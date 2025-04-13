import express from "express";
import cors from "cors";
import resourcesData from "./data.js";
// Import Google Generative AI
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Gemini Initialization ---
const genAI = new GoogleGenerativeAI("AIzaSyBqNaAOL-GaBHoznIkNkbqvXZTam0quRw4");
const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });  // For generation (Using flash for speed/cost efficiency)

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
  "computer": "Computer",
  "macbook": "Macbook",
  "windows": "Windows",
  "room": "Space",
  "study room": "Study Room",
  "conference room": "Conference Room",
  "gpu": "Working with GPUs",
  "gpus": "Working with GPUs",
  "graphics card": "Working with GPUs",
  "space": "Space",
  "charging": "Charger", // Added "charging" to map to the "Charger" category
  "options": "Charger", // Added "options" to map to the "Charger" category
  "study": "Space", // Added "study" to map to the "Space" category
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
      console.log(`No specific resources found for query: "${query}" (preprocessed: "${preprocessedQuery}"). Providing static feedback and attempting general AI response.`);

      // Part 1: Define the static feedback message (always included) - **USING MARKDOWN LINK**
      const staticFeedback = `Sorry, we couldn't find any specific resources matching your query in our system. If you'd like to contribute resources, please visit the [Contribute page](http://localhost:3000/contribute).`;

      let aiResponseText = null; // Initialize AI response text
      let aiErrorOccurred = false; // Flag to track AI errors
      let errorMessage = ""; // Store potential error message

      try {
        // Part 2: Attempt to generate the general AI response
        const generalPrompt = `You are a helpful and friendly chatbot. Answer the following question concisely, using Markdown for any formatting like lists or bold text: ${query}`;
        console.log("Sending general query to Gemini.");
        const aiResult = await generativeModel.generateContent(generalPrompt);

        // Validate the response structure
        if (!aiResult || !aiResult.response || typeof aiResult.response.text !== 'function') {
             console.error("Invalid response structure received from generative model for general query:", aiResult);
             throw new Error("Received invalid response structure from the generative model.");
        }

        // Get the text and remove leading/trailing whitespace
        aiResponseText = aiResult.response.text()?.trim();
        console.log("Received general response from Gemini. Length:", aiResponseText?.length ?? 0);

        // Check if the response text is empty after trimming
        if (!aiResponseText) {
            console.warn("Gemini returned an empty response for the general query. Will only show static feedback.");
            // Intentionally do not set aiErrorOccurred = true here, just proceed without AI text
        }

      } catch (error) {
        // Catch errors specifically from the AI call or response processing
        aiErrorOccurred = true;
        errorMessage = error.message; // Store the error message
        console.error("Error generating general knowledge AI response:", error);
      }

      // Part 3: Construct the final response based on whether AI succeeded and provided text
      let finalResponse;

      if (aiErrorOccurred) {
        // If AI errored, combine static feedback with an error note - **USING MARKDOWN LINK**
        finalResponse = `Sorry, we couldn't find any specific resources matching your query in our system. If you'd like to contribute resources, please visit the [Contribute page](http://localhost:3000/contribute).\n\n(Unfortunately, an error occurred while trying to get additional information: ${errorMessage})`;
      } else if (!aiResponseText) {
        // If AI succeeded but gave no text, combine static feedback with a note - **USING MARKDOWN LINK**
        finalResponse = `Sorry, we couldn't find any specific resources matching your query in our system. If you'd like to contribute resources, please visit the [Contribute page](http://localhost:3000/contribute).\n\n(The AI assistant didn't provide additional information for this query.)`;
      } else {
        // If AI succeeded and gave text, combine static feedback and AI response - **STATIC PART USES MARKDOWN LINK**
        finalResponse = `${staticFeedback}\n\n---\n\nRegarding your query "${query}":\n${aiResponseText}`;
      }

      // Determine success status based on AI error
      const successStatus = !aiErrorOccurred;
      const httpStatus = aiErrorOccurred ? 500 : 200; // Use 500 only if AI errored

      // Send the constructed response
      return res.status(httpStatus).json({
        success: successStatus,
        response: finalResponse,
        relatedResources: [],
      });
    }
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