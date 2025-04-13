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

  try {
    // Step 1: Preprocess the query
    const preprocessedQuery = preprocessQuery(query);

    // Step 1.5: Check if the preprocessed query is empty or contains only stop words
    if (!preprocessedQuery || preprocessedQuery.trim() === "") {
      return res.json({
        success: true,
        response: `Sorry, we couldn't find any resources matching your query. If you'd like to contribute resources to our system, please visit the [Contribute page](http://localhost:3000/contribute).`,
        relatedResources: [],
      });
    }

    // Step 2: Check for specific queries first (Laptop Power Bank, Camera)
    if (preprocessedQuery.includes("laptop") && preprocessedQuery.includes("power") && preprocessedQuery.includes("bank")) {
      const powerBankResources = findResourcesByCategory("Laptop power bank");
      if (powerBankResources && powerBankResources.length > 0) {
        let responseText = "Here are the laptop power banks available:\n\n";
        powerBankResources.forEach((resource, index) => {
          if (resource.navigateTo && resource.navigateTo !== "#") {
            responseText += `${index + 1}. **${resource.name}** - [Book here](${resource.navigateTo})\n`;
          } else {
            responseText += `${index + 1}. **${resource.name}** - This resource is not available for booking through our system.\n`;
          }
        });
        return res.json({
          success: true,
          response: responseText,
          relatedResources: powerBankResources,
        });
      }
    }

    if (preprocessedQuery.includes("power") && preprocessedQuery.includes("bank")) {
      const powerBankResources = findResourcesByCategory("Laptop power bank");
      if (powerBankResources && powerBankResources.length > 0) {
        let responseText = "Here are the laptop power banks available:\n\n";
        powerBankResources.forEach((resource, index) => {
          if (resource.navigateTo && resource.navigateTo !== "#") {
            responseText += `${index + 1}. **${resource.name}** - [Book here](${resource.navigateTo})\n`;
          } else {
            responseText += `${index + 1}. **${resource.name}** - This resource is not available for booking through our system.\n`;
          }
        });
        return res.json({
          success: true,
          response: responseText,
          relatedResources: powerBankResources,
        });
      }
    }

    if (preprocessedQuery.includes("camera")) {
      const cameraResources = findResourcesByCategory("Camera");
      if (cameraResources && cameraResources.length > 0) {
        let responseText = "Here are the cameras available for loan:\n\n";
        cameraResources.forEach((resource, index) => {
          if (resource.navigateTo && resource.navigateTo !== "#") {
            responseText += `${index + 1}. **${resource.name}** - [Book here](${resource.navigateTo})\n`;
          } else {
            responseText += `${index + 1}. **${resource.name}** - This resource is not available for booking through our system.\n`;
          }
        });
        return res.json({
          success: true,
          response: responseText,
          relatedResources: cameraResources,
        });
      }
    }

    // Step 3: Attempt to find a category using keywords
    const matchedCategory = findCategoryFromKeywords(preprocessedQuery);
    console.log("Matched category:", matchedCategory); // ADDED

    let resources = [];
    if (matchedCategory) {
      // If a category match is found, return the resources for that category
      resources = findResourcesByCategory(matchedCategory);
    }

    if (resources.length > 0) {
      // Step 4: Generate AI-powered response based on resources
      const resourceDetails = resources.map(resource => `- ${resource.name}: ${resource.description}`).join("\n");
      const prompt = `You are a helpful assistant for GradGear, helping users find university resources.  Based on the following resources, generate a concise and informative response to the user's query: "${query}".  Include booking links where available.\n\nResources:\n${resourceDetails}\n\nResponse:`;

      try {
        const result = await generativeModel.generateContent(prompt);
        const responseText = result.response.text();
        return res.json({
          success: true,
          response: responseText,
          relatedResources: resources,
        });
      } catch (error) {
        console.error("Error generating AI response:", error);
        // Fallback to a simple response if AI generation fails
        let responseText = `Here are the resources we found in the **${matchedCategory}** category for your query:\n\n`;
        resources.forEach((resource, index) => {
          if (resource.navigateTo && resource.navigateTo !== "#") {
            responseText += `${index + 1}. **${resource.name}** - [Book here](${resource.navigateTo})\n`;
          } else {
            responseText += `${index + 1}. **${resource.name}** - This resource is not available for booking through our system.\n`;
          }
        });
        return res.json({
          success: true,
          response: responseText,
          relatedResources: resources,
        });
      }
    } else {
      // Step 5: If no resource match is found, use Gemini for general knowledge
      const prompt = `You are a helpful and friendly chatbot. Answer the following question: ${query}`;
      try {
        const result = await generativeModel.generateContent(prompt);
        const responseText = result.response.text();
        return res.json({
          success: true,
          response: responseText,
          relatedResources: [],
        });
      } catch (error) {
        console.error("Error generating general knowledge response:", error);
        return res.status(500).json({
          success: false,
          error: "Internal Server Error. Please try again later.",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});