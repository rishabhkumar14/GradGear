import express from "express";
import cors from "cors";
import resourcesData from "./data.js";
// Import Google Generative AI
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'; // Ensure environment variables are loaded

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Gemini Initialization ---

const genAI = new GoogleGenerativeAI("AIzaSyBqNaAOL-GaBHoznIkNkbqvXZTam0quRw4");
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" }); // For semantic search
const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});  // For generation

// Dynamically generate categories from resourcesData
const categories = Object.keys(resourcesData);

// Keyword-to-category mapping for fallback
const keywordCategoryMap = {
  "power bank": "Laptop power bank",
  "laptop power bank": "Laptop power bank",
  "charger": "Charger",
  "adapter": "Charger",
  "camera": "Camera",
  "microscope": "Accessories",
  "projector": "Projector",
  "laptop": "Laptop",
  "computer": "Laptop",
  "macbook": "Laptop",
  "windows": "Laptop",
  "room": "Space",
  "study room": "Space",
  "conference room": "Space",
  "gpu": "Working with GPUs",
  "gpus": "Working with GPUs",
  "graphics": "Working with GPUs",
  "graphic": "Working with GPUs",
  "graphics card": "Working with GPUs",
  "space": "Space",
  "charging": "Charger",
  "options": "Charger",
  "study": "Space",
};

// Function to preprocess the query
function preprocessQuery(query) {
  // Remove common stop words to focus on meaningful terms
  const stopWords = ["where", "can", "i", "find", "get", "a", "the", "how", "want", "to", "book", "i", "need", "tell", "me", "about", "on", "campus", "are", "available", "for", "loan", "what", "do", "water"];
  const processedQuery = query
    .toLowerCase()
    .replace(/[?]/g, '')
    .split(/\s+/)
    .filter((word) => !stopWords.includes(word))
    .join(" ");
  console.log("Preprocessed Query:", processedQuery); // Log the preprocessed query
  return processedQuery;
}

// Function to find a category using keywords
function findCategoryFromKeywords(query) {
  const queryWords = query.toLowerCase().split(/\s+/);

  // Check for individual keywords in the map
  for (const word of queryWords) {
    if (keywordCategoryMap[word]) {
      return keywordCategoryMap[word];
    }
  }

  return null;
}

// Function to find resources within a category
function findResourcesByCategory(category) {
  return resourcesData[category] || [];
}

// --- Embedding Generation and Similarity (NEW/RE-ADD) ---
async function generateEmbeddings(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn("Attempted to generate embedding for empty or invalid text.");
    throw new Error("Invalid text provided for embedding generation.");
  }
  try {
    const result = await embeddingModel.embedContent(text);
    const embedding = result.embedding;
    if (!embedding || !Array.isArray(embedding.values)) {
        throw new Error("Invalid embedding structure received from API.");
    }
    return embedding.values;
  } catch (error) {
    console.error("Error generating embeddings for text:", text.substring(0, 50) + "...", error.message);
    throw new Error(`Failed to generate embeddings. API Error: ${error.message}`);
  }
}

function cosineSimilarity(embedding1, embedding2) {
  if (!Array.isArray(embedding1) || !Array.isArray(embedding2) || embedding1.length !== embedding2.length || embedding1.length === 0) {
    return 0;
  }
  // ... (rest of cosine similarity calculation) ...
  const dotProduct = embedding1.reduce((sum, a, i) => sum + a * embedding2[i], 0);
  const magnitude1 = Math.sqrt(embedding1.reduce((sum, a) => sum + a * a, 0));
  const magnitude2 = Math.sqrt(embedding2.reduce((sum, a) => sum + a * a, 0));
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  const similarity = dotProduct / (magnitude1 * magnitude2);
  return Math.max(-1, Math.min(1, similarity));
}

// --- Data Preparation & Embedding Initialization (NEW/RE-ADD) ---
let allResourcesWithEmbeddings = []; // Store flat list of resources with embeddings
let isEmbeddingsInitialized = false;

async function initializeEmbeddings() {
  isEmbeddingsInitialized = false;
  console.log("Initializing embeddings for all resources...");
  const tempResourceList = [];
  let resourceCount = 0;
  let successCount = 0;

  for (const category in resourcesData) {
    const resources = resourcesData[category];
    if (!Array.isArray(resources)) continue;

    for (const resource of resources) {
        resourceCount++;
        // --- MODIFICATION START: Include useCases and tags ---
        const useCaseText = resource.useCases && Array.isArray(resource.useCases) ? resource.useCases.join(' ') : '';
        const tagText = resource.tags && Array.isArray(resource.tags) ? resource.tags.join(' ') : ''; // Assuming you might have tags

        // Combine name, category, description, use cases, and tags for embedding
        const text = `${resource.name} ${category} ${resource.description || ''} ${useCaseText} ${tagText}`.trim().replace(/\s+/g, ' '); // Consolidate whitespace
        // --- MODIFICATION END ---

        if (!text) {
          console.warn(`Skipping resource "${resource.name}" (Category: ${category}) due to empty text.`);
          continue;
        }

        try {
          const embedding = await generateEmbeddings(text);
          // Add embedding and original category to the resource object
          tempResourceList.push({ ...resource, category, embedding });
          successCount++;
          if (successCount % 10 === 0 || successCount === 1) {
             console.log(`Generated embeddings for ${successCount}/${resourceCount} resources...`);
          }
        } catch (error) {
          console.error(`Failed embedding for resource: ${resource.name} (Category: ${category}). Error: ${error.message}`);
        }
    } // end resource loop
  } // end category loop

  allResourcesWithEmbeddings = tempResourceList; // Update global store
  isEmbeddingsInitialized = successCount > 0;
  console.log(`Embeddings initialized. ${successCount}/${resourceCount} resources embedded successfully.`);
}

// --- Run Embedding Initialization on Startup ---
(async () => {
  try {
    await initializeEmbeddings();
    if (!isEmbeddingsInitialized) {
        console.error("CRITICAL: No resource embeddings could be initialized.");
    }
  } catch (error) {
    console.error("Fatal error during embedding initialization:", error);
    process.exit(1);
  }
})();

// --- Configuration for Embedding Search ---
const SIMILARITY_THRESHOLD = 0.70; // Adjust this threshold based on testing! Higher = stricter match.
const MAX_EMBEDDING_RESULTS = 3;   // Max resources to show from embedding search

// Endpoint to handle chatbot queries
app.post("/api/query", async (req, res) => {
  const { query } = req.body;

  // Add basic input validation
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Query is required and must be non-empty text." });
  }

  try {
    // Step 1: Preprocess the query
    const preprocessedQuery = preprocessQuery(query);

    // Step 2: Check for specific hardcoded queries first (Power Bank, Camera)
    if (preprocessedQuery.includes("laptop") && preprocessedQuery.includes("power") && preprocessedQuery.includes("bank")) {
      const powerBankResources = findResourcesByCategory("Laptop power bank");
      if (powerBankResources && powerBankResources.length > 0) {
        let responseText = "Here are the laptop power banks available:\n\n";
        powerBankResources.forEach((resource) => {
           if (resource.navigateTo && resource.navigateTo !== "#") {
             responseText += `* **${resource.name}** - [Book here](${resource.navigateTo})\n`;
           } else {
             responseText += `* **${resource.name}** - This resource is not available for booking through our system.\n`;
           }
        });
        console.log("--- BACKEND Sending Response (Laptop Power Bank Check) ---");
        console.log("Raw responseText:", responseText);
        console.log("------------------------------------------------------");
        return res.json({ success: true, response: responseText, relatedResources: powerBankResources });
      }
    }
    // Simplified power bank check (if needed)
    if (preprocessedQuery.includes("power") && preprocessedQuery.includes("bank") && !(preprocessedQuery.includes("laptop"))) {
         const powerBankResources = findResourcesByCategory("Laptop power bank");
         if (powerBankResources && powerBankResources.length > 0) {
            let responseText = "Here are the laptop power banks available:\n\n";
            powerBankResources.forEach((resource) => {
               if (resource.navigateTo && resource.navigateTo !== "#") {
                 responseText += `* **${resource.name}** - [Book here](${resource.navigateTo})\n`;
               } else {
                 responseText += `* **${resource.name}** - This resource is not available for booking through our system.\n`;
               }
            });
            console.log("--- BACKEND Sending Response (Simple Power Bank Check) ---");
            console.log("Raw responseText:", responseText);
            console.log("-------------------------------------------------");
            return res.json({ success: true, response: responseText, relatedResources: powerBankResources });
         }
    }
    if (preprocessedQuery.includes("camera")) {
      const cameraResources = findResourcesByCategory("Camera");
      if (cameraResources && cameraResources.length > 0) {
         let responseText = "Here are the cameras available for loan:\n\n";
         cameraResources.forEach((resource) => {
            if (resource.navigateTo && resource.navigateTo !== "#") {
              responseText += `* **${resource.name}** - [Book here](${resource.navigateTo})\n`;
            } else {
              responseText += `* **${resource.name}** - This resource is not available for booking through our system.\n`;
            }
         });
         return res.json({ success: true, response: responseText, relatedResources: cameraResources });
      }
    }

    // Step 3: Attempt to find a category using keywords
    const matchedCategory = findCategoryFromKeywords(preprocessedQuery);
    console.log("Matched category:", matchedCategory);

    let resources = [];
    if (matchedCategory) {
      // If a category match is found, retrieve the resources
      resources = findResourcesByCategory(matchedCategory);
    }

    // Check if category match yielded resources
    if (resources.length > 0) {
      // Step 4: Generate AI-powered response based on FOUND resources
      console.log(`Found ${resources.length} resources in category "${matchedCategory}". Generating AI response.`);
      const resourceDetails = resources
          .map(resource => `- **${resource.name}**: ${resource.description || 'No description.'}${resource.navigateTo && resource.navigateTo !== '#' ? ` [Book Here](${resource.navigateTo})` : ''}`)
          .join("\n");

      // --- MODIFIED PROMPT ---
      const contextPrompt = `You are a helpful assistant for GradGear. Answer the user's query: "${query}".
Base your response ONLY on the following resources found in the "${matchedCategory}" category.
Present the relevant resources as a plain Markdown list (using * or -). Use bold text (\`**Text**\`) only for the resource names. Make sure to include the specific booking links provided using Markdown link syntax \`[Book Here](URL)\`.
If a resource seems less directly relevant to the user's query focus (e.g., an adapter when asking for chargers), include it in the list but describe its function or relevance in plain text without using italics.

Resources:
${resourceDetails}

Concise Response (using plain Markdown list, bold names, and links only):`;
      // --- END MODIFIED PROMPT ---

      try {
        const result = await generativeModel.generateContent(contextPrompt);
         // Add response validation
        if (!result || !result.response || typeof result.response.text !== 'function') {
             console.error("Invalid response structure received from generative model for category query:", result);
             throw new Error("Received invalid response structure from the generative model.");
        }
        const responseText = result.response.text();
      return res.json({
        success: true,
        response: responseText,
          relatedResources: resources,
        });
      } catch (error) {
        console.error("Error generating AI response for category:", error);
        // Fallback to a simple structured response if AI generation fails for category match
        let fallbackResponseText = `I found the following resources in the **${matchedCategory}** category, which might be related to your query:\n\n`;
        resources.forEach((resource, index) => {
            fallbackResponseText += `${index + 1}. **${resource.name}**`;
            if (resource.navigateTo && resource.navigateTo !== "#") {
                fallbackResponseText += ` - [Book here](${resource.navigateTo})\n`;
            } else {
                fallbackResponseText += ` - Booking link not available.\n`;
            }
        });
        fallbackResponseText += "\n\n(There was an issue generating a more detailed AI response.)";
        return res.json({ success: true, response: fallbackResponseText, relatedResources: resources });
      }
    } else {
      // Step 5: No resources found via hardcoded checks OR category matching
      console.log(`No keyword match for query: "${query}". Attempting semantic search.`); // Log action

      let embeddingFoundResults = false; // Flag to track if embeddings yielded results

      if (!isEmbeddingsInitialized) {
        console.warn("Embeddings not ready, proceeding to final fallback.");
      } else {
        // --- Embedding Search Logic (Step 5a) ---
        try {
          const queryEmbedding = await generateEmbeddings(query); // Embed original query

          // Calculate similarities against all pre-computed embeddings
          const allSimilarities = allResourcesWithEmbeddings
            .map(resource => {
                // Ensure resource has a valid embedding before calculating
                if (!resource.embedding || resource.embedding.length === 0) {
                    console.warn(`Resource "${resource.name}" missing valid embedding, skipping similarity.`);
                    return { resource, similarity: -1 }; // Assign low similarity
                }
                return {
                   resource,
                   similarity: cosineSimilarity(queryEmbedding, resource.embedding)
                };
            })
            .filter(item => item.similarity > -1); // Filter out any skipped items if needed

          // --- ADD LOGGING HERE ---
          // Sort all calculated similarities by score (descending) for logging
          allSimilarities.sort((a, b) => b.similarity - a.similarity);

          console.log(`--- Embedding Similarities (Top 10 Raw for query: "${query}") ---`);
          console.table(allSimilarities.slice(0, 10).map(item => ({
              Name: item.resource.name,
              Category: item.resource.category,
              Score: item.similarity.toFixed(4) // Format score
          })));
          console.log(`Similarity Threshold: ${SIMILARITY_THRESHOLD}`);
          console.log("------------------------------------------------------------------");
          // --- END LOGGING ---

          // Filter candidates based on the threshold
          const candidateResources = allSimilarities.filter(item => item.similarity >= SIMILARITY_THRESHOLD);

          const topEmbeddingResources = candidateResources.slice(0, MAX_EMBEDDING_RESULTS); // Take top N *after* thresholding

          if (topEmbeddingResources.length > 0) {
            embeddingFoundResults = true;
            console.log(`Embedding search found ${topEmbeddingResources.length} resources above threshold. Generating AI response.`);

            // --- Corrected Code Start ---
            // Format the details for the AI prompt
            const embeddingResourceDetails = topEmbeddingResources
                .map(({ resource, similarity }) => // Destructure here
                    `- **${resource.name}** (Category: ${resource.category}): ${resource.description || 'No description.'}${resource.navigateTo && resource.navigateTo !== '#' ? ` [Book Here](${resource.navigateTo})` : ''} (Similarity: ${similarity.toFixed(2)})`
                )
                .join("\n");

            // Define the prompt for the AI
            const embeddingContextPrompt = `You are a helpful assistant for GradGear. Answer the user's query: "${query}".
Base your response ONLY on the following resources found because they seem semantically related to your query (keywords, description, or use case), provide a helpful response.
Present the relevant resources as a plain Markdown list. Use bold text (\`**Text**\`) only for resource names. Include booking links using \`[Book Here](URL)\`. Note the category for context.

Related Resources Found:
${embeddingResourceDetails}

Concise Response (using plain Markdown list, based on relevance to query):`;

            // Call the AI and handle its response/errors
            try {
                const result = await generativeModel.generateContent(embeddingContextPrompt);
                // Add response validation
                if (!result || !result.response || typeof result.response.text !== 'function') {
                    console.error("Invalid response structure from generative model for embedding query:", result);
                    throw new Error("Received invalid response structure from the generative model.");
                }
                const responseText = result.response.text();
                return res.json({
                    success: true,
                    response: responseText,
                    // Return the resources found via embedding
                    relatedResources: topEmbeddingResources.map(item => item.resource)
                });
            } catch(error) {
                console.error("Error generating AI response for embedding results:", error);
                // Fallback if AI fails after embedding search: list the found resources simply
                 let fallbackResponseText = `I found the following resources that seem semantically related to your query "${query}":\n\n`;
                 topEmbeddingResources.forEach(({ resource }) => { // Destructure here too
                    fallbackResponseText += `* **${resource.name}** (Category: ${resource.category})`;
                    if (resource.navigateTo && resource.navigateTo !== "#") {
                        fallbackResponseText += ` - [Book here](${resource.navigateTo})\n`;
                    } else {
                        fallbackResponseText += ` - Booking link not available.\n`;
                    }
                 });
                 fallbackResponseText += "\n\n(There was an issue generating a more detailed AI response.)";
                 return res.json({
                    success: true,
                    response: fallbackResponseText,
                    relatedResources: topEmbeddingResources.map(item => item.resource)
                 });
            }
            // --- Corrected Code End ---
          } else {
              console.log(`Embedding search completed but found no results above threshold ${SIMILARITY_THRESHOLD}.`);
          }
        } catch (embeddingError) {
            console.error("Error during embedding search process:", embeddingError);
            // Let execution proceed to final fallback
        }
      } // End if embeddings initialized

      // --- Step 5b: Final Fallback ---
      // This code ONLY runs if embeddingFoundResults is still false
      if (!embeddingFoundResults) {
          console.log(`Proceeding to final fallback (Static + General AI) for query: "${query}".`); // Should see this log

          const staticFeedback = `Sorry, we couldn't find any specific resources matching your query in our system. If you'd like to contribute resources, please visit the [Contribute page](http://localhost:3000/contribute).`;
          let aiResponseText = null;
          let aiErrorOccurred = false;
          let specificErrorMessage = ""; // Use a distinct name

          try {
            const generalPrompt = `You are a helpful and friendly chatbot. Answer the following question concisely, using Markdown for any formatting like lists or bold text: ${query}`;
            console.log("Fallback: Sending general query to Gemini."); // Log before call
            const aiResult = await generativeModel.generateContent(generalPrompt);
            console.log("Fallback: Received general AI response object."); // Log after call completes

            // Validate structure
            if (!aiResult || !aiResult.response || typeof aiResult.response.text !== 'function') {
                 console.error("Fallback: Invalid response structure from general query:", aiResult);
                 throw new Error("Invalid response structure from the general model.");
            }
            aiResponseText = aiResult.response.text()?.trim();
            console.log("Fallback: Extracted general AI text. Length:", aiResponseText?.length ?? 0);

            if (!aiResponseText) {
                console.warn("Fallback: Gemini returned an empty response for the general query.");
            }

          } catch (error) {
             aiErrorOccurred = true;
             specificErrorMessage = error.message; // Correct variable name
             console.error("Fallback: Error during general knowledge AI call/processing:", error); // Log the specific error
          }

          // Construct final response (logic remains the same)
          let finalResponse;
          if (aiErrorOccurred) {
             finalResponse = `${staticFeedback}\n\n(Unfortunately, an error occurred while trying to get additional information: ${specificErrorMessage})`; // Use correct variable
          } else if (!aiResponseText) {
             finalResponse = `${staticFeedback}\n\n(The AI assistant didn't provide additional information for this query.)`;
          } else {
             finalResponse = `${staticFeedback}\n\n---\n\nRegarding your query "${query}":\n${aiResponseText}`;
          }

          const successStatus = !aiErrorOccurred;
          const httpStatus = aiErrorOccurred ? 500 : 200;

          console.log(`Fallback: Sending final response. Status: ${httpStatus}, Success: ${successStatus}`); // Log before sending
          return res.status(httpStatus).json({ // Ensure this return is always hit
            success: successStatus,
            // Use error field if AI failed, otherwise use response
            [aiErrorOccurred ? 'error' : 'response']: finalResponse,
            relatedResources: [],
          });
      }
      // Add a safety net return in case logic somehow misses the above blocks
      console.error("SERVER ERROR: Reached end of /api/query handler unexpectedly.");
      return res.status(500).json({ success: false, error: "Internal Server Error: Unexpected flow."});

    } // End final else (Step 5)
  } catch (error) {
    // General catch block for unexpected errors outside the AI call in Step 5
    console.error("Unexpected error in /api/query:", error);
    res.status(500).json({
      success: false,
      error: `Internal Server Error. Please check server logs. Error: ${error.message}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});