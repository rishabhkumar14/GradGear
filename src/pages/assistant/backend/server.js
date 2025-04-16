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
  "projector": "Accessories",
  "laptop": "Laptop",
  // "computer": "Laptop",
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
      console.log(resourceDetails);

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