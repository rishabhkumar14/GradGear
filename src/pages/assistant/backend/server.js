import express from "express";
import cors from "cors";
import resourcesData from "./data.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
  "computer": "Laptop",
  "macbook": "Laptop",
  "windows": "Laptop",
  "room": "Space",
  "study room": "Space",
  "conference room": "Space",
  "gpu": "Working with GPUs",
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

    if (matchedCategory) {
      // If a category match is found, return the resources for that category
      const resources = findResourcesByCategory(matchedCategory);
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

    // Step 4: Attempt to find resources directly by matching keywords in resource names/descriptions
    const matchedResources = [];
    for (const [category, resources] of Object.entries(resourcesData)) {
      for (const resource of resources) {
        const resourceText = `${resource.name} ${resource.description}`.toLowerCase();
        if (preprocessedQuery.split(" ").some((word) => resourceText.includes(word))) {
          matchedResources.push(resource);
        }
      }
    }

    if (matchedResources.length > 0) {
      let responseText = `Here are the resources we found that match your query:\n\n`;
      matchedResources.forEach((resource, index) => {
        if (resource.navigateTo && resource.navigateTo !== "#") {
          responseText += `${index + 1}. **${resource.name}** - [Book here](${resource.navigateTo})\n`;
        } else {
          responseText += `${index + 1}. **${resource.name}** - This resource is not available for booking through our system.\n`;
        }
      });

      return res.json({
        success: true,
        response: responseText,
        relatedResources: matchedResources,
      });
    }

    // Step 5: If no match is found, return a fallback response
    return res.json({
      success: true,
      response: `Sorry, we couldn't find any resources matching your query. If you'd like to contribute resources to our system, please visit the [Contribute page](http://localhost:3000/contribute).`,
      relatedResources: [],
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Please try again later or visit the [Contribute page](http://localhost:3000/contribute) to add resources.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});