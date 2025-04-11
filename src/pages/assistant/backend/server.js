import express from "express";
import cors from "cors";
import OpenAI from "openai";
import resourcesData from "./data.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI API Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

// Dynamically generate categories from resourcesData
const categories = Object.keys(resourcesData);

// In-memory storage for embeddings
const categoryEmbeddings = {};
const resourceEmbeddings = [];

// Function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Generate embeddings for categories and resources
async function generateEmbeddings() {
  try {
    // Generate embeddings for categories
    for (const category of categories) {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: category,
      });
      categoryEmbeddings[category] = embeddingResponse.data[0].embedding;
    }

    // Generate embeddings for resources
    for (const [category, resources] of Object.entries(resourcesData)) {
      for (const resource of resources) {
        const resourceText = `${resource.name} ${resource.description}`;
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: resourceText,
        });
        resourceEmbeddings.push({
          category,
          resource,
          embedding: embeddingResponse.data[0].embedding,
        });
      }
    }

    console.log("Embeddings generated successfully.");
  } catch (error) {
    console.error("Error generating embeddings:", error);
  }
}

// Call the function to generate embeddings
generateEmbeddings();

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
};

// Function to preprocess the query
function preprocessQuery(query) {
  // Remove common stop words to focus on meaningful terms
  const stopWords = ["where", "can", "i", "find", "get", "a", "the"];
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => !stopWords.includes(word))
    .join(" ");
}

// Function to find a category using keywords
function findCategoryFromKeywords(query) {
  const queryWords = query.toLowerCase().split(/\s+/);

  // Special case: Check for "laptop power bank" as a whole phrase first
  if (query.toLowerCase().includes("laptop power bank")) {
    return "Laptop power bank";
  }

  // Special case: Check for "power" and "bank" together
  if (queryWords.includes("power") && queryWords.includes("bank")) {
    return "Laptop power bank";
  }

  // Check for individual keywords in the map
  for (const word of queryWords) {
    if (keywordCategoryMap[word]) {
      return keywordCategoryMap[word];
    }
  }

  return null;
}

// Endpoint to handle chatbot queries
app.post("/api/query", async (req, res) => {
  const { query } = req.body;

  try {
    // Step 1: Attempt to find a category using keywords (raw query)
    const keywordMatchedCategory = findCategoryFromKeywords(query);
    if (keywordMatchedCategory) {
      // If a keyword match is found, directly return the resources for that category
      const resources = resourcesData[keywordMatchedCategory] || [];
      let responseText = `Here are the resources we found in the **${keywordMatchedCategory}** category for your query:\n\n`;
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

    // Step 2: Preprocess the query for embedding-based similarity
    const preprocessedQuery = preprocessQuery(query);

    // Step 3: Generate embedding for the user's query
    const queryEmbeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: preprocessedQuery,
    });
    const queryEmbedding = queryEmbeddingResponse.data[0].embedding;

    // Step 4: Find the most relevant category
    let bestCategory = null;
    let highestCategorySimilarity = -1;
    const similarityThreshold = 0.75; // Keep the strict threshold

    for (const [category, embedding] of Object.entries(categoryEmbeddings)) {
      const similarity = cosineSimilarity(queryEmbedding, embedding);
      if (similarity > highestCategorySimilarity) {
        highestCategorySimilarity = similarity;
        bestCategory = category;
      }
    }

    // Check if the highest similarity is below the threshold
    if (highestCategorySimilarity < similarityThreshold) {
      return res.json({
        success: true,
        response: `Sorry, we couldn't find any resources matching your query. If you'd like to contribute resources to our system, please visit the [Contribute page](http://localhost:3000/contribute).`,
        relatedResources: [],
      });
    }

    // Step 5: Find the most relevant resources within the best category
    const filteredResources = resourceEmbeddings
      .filter((item) => item.category === bestCategory)
      .map((item) => ({
        resource: item.resource,
        similarity: cosineSimilarity(queryEmbedding, item.embedding),
      }))
      .filter((item) => item.similarity >= similarityThreshold) // Apply the threshold to resources
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5) // Limit to top 5 results
      .map((item) => item.resource);

    // Step 6: Generate a response based on the resources
    let responseText = "";
    if (filteredResources.length > 0) {
      responseText = `Here are the resources we found in the **${bestCategory}** category for your query:\n\n`;
      filteredResources.forEach((resource, index) => {
        if (resource.navigateTo && resource.navigateTo !== "#") {
          responseText += `${index + 1}. **${resource.name}** - [Book here](${resource.navigateTo})\n`;
        } else {
          responseText += `${index + 1}. **${resource.name}** - This resource is not available for booking through our system.\n`;
        }
      });
    } else {
      responseText = `Sorry, we couldn't find any resources matching your query. If you'd like to contribute resources to our system, please visit the [Contribute page](http://localhost:3000/contribute).`;
    }

    // Send the response back to the frontend
    return res.json({
      success: true,
      response: responseText,
      relatedResources: filteredResources,
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