const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config/config');

// Initialize Gemini API with the API key from config
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

// Get models for embeddings and text generation
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Cache for resource embeddings
let resourceEmbeddingsCache = [];
let isEmbeddingsInitialized = false;

/**
 * Generates embeddings for the provided text
 * @param {string} text - Text to generate embeddings for
 * @returns {Promise<number[]>} - Array of embedding values
 */
async function generateEmbeddings(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn("Attempted to generate embedding for empty or invalid text");
    throw new Error("Invalid text provided for embedding generation");
  }

  try {
    const result = await embeddingModel.embedContent(text);
    const embedding = result.embedding;
    
    if (!embedding || !Array.isArray(embedding.values)) {
      throw new Error("Invalid embedding structure received from API");
    }
    
    return embedding.values;
  } catch (error) {
    console.error("Error generating embeddings:", error.message);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
}

/**
 * Calculates cosine similarity between two embeddings
 * @param {number[]} embedding1 - First embedding vector
 * @param {number[]} embedding2 - Second embedding vector
 * @returns {number} - Similarity score between -1 and 1
 */
function cosineSimilarity(embedding1, embedding2) {
  if (!Array.isArray(embedding1) || !Array.isArray(embedding2) || 
      embedding1.length !== embedding2.length || embedding1.length === 0) {
    return 0;
  }
  
  const dotProduct = embedding1.reduce((sum, a, i) => sum + a * embedding2[i], 0);
  const magnitude1 = Math.sqrt(embedding1.reduce((sum, a) => sum + a * a, 0));
  const magnitude2 = Math.sqrt(embedding2.reduce((sum, a) => sum + a * a, 0));
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return Math.max(-1, Math.min(1, dotProduct / (magnitude1 * magnitude2)));
}

/**
 * Preprocesses a query to remove common stop words and focus on meaningful terms
 * @param {string} query - Original user query
 * @returns {string} - Processed query
 */
function preprocessQuery(query) {
  const stopWords = ["where", "can", "i", "find", "get", "a", "the", "how", "want", 
                     "to", "book", "need", "tell", "me", "about", "on", "campus", 
                     "are", "available", "for", "loan", "what", "do", "you", "know", 
                     "is", "there", "any", "have", "would", "like", "looking"];
  
  const processedQuery = query
    .toLowerCase()
    .replace(/[?.,!;:]/g, '') // Remove punctuation
    .split(/\s+/)             // Split into words
    .filter(word => !stopWords.includes(word)) // Remove stop words
    .join(" ");
    
  return processedQuery;
}

/**
 * Initializes embeddings for all resources in the data
 * @param {Object} resourcesData - Resource data object organized by categories
 * @returns {Promise<void>}
 */
async function initializeResourceEmbeddings(resourcesData) {
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
      
      // Create rich text representation for embedding by combining various fields
      const chipText = resource.chips && Array.isArray(resource.chips) ? resource.chips.join(' ') : '';
      const locationText = resource.locations && Array.isArray(resource.locations) ? resource.locations.join(' ') : '';
      
      // Enhanced text representation with all available semantic information
      const text = `${resource.name} ${category} ${resource.description || ''} ${chipText} ${locationText}`.trim().replace(/\s+/g, ' ');
      
      if (!text) {
        console.warn(`Skipping resource "${resource.name}" (Category: ${category}) due to empty text`);
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
    }
  }

  resourceEmbeddingsCache = tempResourceList;
  isEmbeddingsInitialized = successCount > 0;
  console.log(`Embeddings initialized. ${successCount}/${resourceCount} resources embedded successfully`);
}

/**
 * Finds the most semantically similar resources to a query
 * @param {string} query - User query
 * @param {number} threshold - Similarity threshold (0-1)
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} - Array of resource objects with similarity scores
 */
async function findSimilarResources(query, threshold = 0.65, maxResults = 3) {
  if (!isEmbeddingsInitialized) {
    throw new Error("Resource embeddings have not been initialized");
  }
  
  try {
    const queryEmbedding = await generateEmbeddings(query);
    
    // Calculate similarities for all resources
    const similarities = resourceEmbeddingsCache.map(resource => ({
      resource,
      similarity: cosineSimilarity(queryEmbedding, resource.embedding)
    }));
    
    // Sort by similarity (descending)
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    // Log top similarities for debugging
    console.log("--- Top 5 semantic matches ---");
    similarities.slice(0, 5).forEach(item => {
      console.log(`${item.resource.name} (${item.resource.category}): ${item.similarity.toFixed(4)}`);
    });
    
    // Filter by threshold and limit results
    return similarities
      .filter(item => item.similarity >= threshold)
      .slice(0, maxResults);
  } catch (error) {
    console.error("Error finding similar resources:", error);
    throw error;
  }
}

/**
 * Handles a user query and generates a response using RAG
 * @param {string} query - User query
 * @param {Object} resourcesData - Resource data object
 * @returns {Promise<Object>} - Response object with text and related resources
 */
async function handleQuery(query, resourcesData) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error("Invalid query: Query must be a non-empty string");
  }
  
  try {
    // Initialize embeddings if not already done
    if (!isEmbeddingsInitialized) {
      await initializeResourceEmbeddings(resourcesData);
    }
    
    // Preprocess the query
    const processedQuery = preprocessQuery(query);
    console.log(`Original query: "${query}"`);
    console.log(`Processed query: "${processedQuery}"`);
    
    // Create a keyword-to-category map for direct matches
    const keywordMap = {
      // Spaces & Rooms
      "study room": "spaces", "study space": "spaces", "room": "spaces", 
      "classroom": "spaces", "meeting room": "spaces", "conference": "spaces",
      "reserve room": "spaces", "book room": "spaces", "snell": "spaces",
      
      // Power & Charging
      "power bank": "lockers", "charger": "charger", "charging": "charger",
      "adapter": "charger", "magsafe": "charger", "charge": "charger",
      "power": "charger", "surface charger": "charger", "usb-c": "charger",
      
      // Computing
      "laptop": "laptop", "computer": "laptop", "macbook": "laptop", 
      "apple laptop": "laptop", "windows laptop": "laptop", "surface": "laptop",
      
      // Peripherals & Equipment
      "camera": "camera", "theta": "camera", "360": "camera", "handycam": "camera",
      "camcorder": "camera", "record video": "camera", "recording": "camera",
      
      // Accessories
      "projector": "accessories", "microscope": "accessories", "bluetooth presenter": "vending accessories",
      "voice recorder": "vending accessories", "audio recorder": "vending accessories", 
      "presenter": "vending accessories", "pointer": "vending accessories",
      
      // Computing Resources
      "gpu": "working with gpus", "gpus": "working with gpus", "high performance": "working with gpus",
      "computing": "working with gpus", "hpc": "working with gpus", "cluster": "working with gpus",
      "machine learning": "working with gpus", "deep learning": "working with gpus"
    };
    
    // Check for direct category matches based on keywords
    let directMatchCategory = null;
    const words = processedQuery.split(/\s+/);
    
    // Check for multi-word phrases first
    for (const [keyword, category] of Object.entries(keywordMap)) {
      if (keyword.includes(' ') && processedQuery.includes(keyword)) {
        directMatchCategory = category;
        console.log(`Direct multi-word match found: "${keyword}" -> ${category}`);
        break;
      }
    }
    
    // If no multi-word match, check single words
    if (!directMatchCategory) {
      for (const word of words) {
        if (keywordMap[word]) {
          directMatchCategory = keywordMap[word];
          console.log(`Direct single-word match found: "${word}" -> ${directMatchCategory}`);
          break;
        }
      }
    }
    
    // If direct category match found, get resources from that category
    if (directMatchCategory && resourcesData[directMatchCategory]) {
      const categoryResources = resourcesData[directMatchCategory];
      console.log(`Using direct category match: ${directMatchCategory} (${categoryResources.length} resources)`);
      
      // Generate response using Gemini with category match context
      const resourceDetails = categoryResources
        .map(resource => `- **${resource.name}**: ${resource.description.split('.')[0]}. ${resource.navigateTo && resource.navigateTo !== '#' ? `[Book Here](${resource.navigateTo})` : 'No booking link available.'}`)
        .join("\n");
      
      const prompt = `You are a helpful assistant for GradGear, a university resource portal. 
Answer the user's query: "${query}"

Base your response ONLY on the following resources from the "${directMatchCategory}" category:
${resourceDetails}

Your response should:
1. Be conversational and helpful
2. Present relevant resources in a clear Markdown list format 
3. Use bold (**Resource Name**) for resource names
4. Include booking links where available
5. Focus on resources most relevant to the specific query
6. Be concise but informative (no more than 150 words)`;

      const result = await generativeModel.generateContent(prompt);
      const responseText = result.response.text();
      
      return {
        success: true,
        response: responseText,
        relatedResources: categoryResources,
        matchType: "category"
      };
    }
    
    // If no direct category match, use semantic search via embeddings
    console.log("No direct category match found, using semantic search...");
    const similarResults = await findSimilarResources(query);
    
    if (similarResults.length > 0) {
      console.log(`Found ${similarResults.length} semantically similar resources`);
      
      // Format resources for the prompt
      const resourceDetails = similarResults
        .map(({ resource, similarity }) => 
          `- **${resource.name}** (Category: ${resource.category}, Similarity: ${similarity.toFixed(2)}): ${resource.description.split('.')[0]}. ${resource.navigateTo && resource.navigateTo !== '#' ? `[Book Here](${resource.navigateTo})` : 'No booking link available.'}`
        )
        .join("\n");
      
      const prompt = `You are a helpful assistant for GradGear, a university resource portal.
Answer the user's query: "${query}"

Based on semantic similarity, I found these potentially relevant resources:
${resourceDetails}

Your response should:
1. Be conversational and helpful
2. Present the resources in a clear Markdown list format, starting with the most relevant one
3. Use bold (**Resource Name**) for resource names
4. Include booking links where available
5. Briefly explain why each resource might be relevant to their query
6. Be concise but informative (no more than a 150 words)`;

      const result = await generativeModel.generateContent(prompt);
      const responseText = result.response.text();
      
      return {
        success: true,
        response: responseText,
        relatedResources: similarResults.map(item => item.resource),
        matchType: "semantic"
      };
    }
    
    // If no results found through either method, generate a fallback response
    console.log("No resources found through any method, using fallback response");
    
    const fallbackPrompt = `You are a helpful assistant for GradGear, a university resource portal.
The user asked: "${query}"

Unfortunately, we couldn't find any specific resources matching this query in our system.

Provide a friendly, helpful response that:
1. Acknowledges we don't have an exact match for their specific request
2. Suggests they might try different keywords or be more specific
3. Mentions they can contribute missing resources via the Contribute page. The link for the contribute page is http://localhost:3000/contribute. Hide the link behind the text "Contribute page"
4. Offers to help with any other resource-related questions
5. Is concise (no more than 100 words)`;

    const result = await generativeModel.generateContent(fallbackPrompt);
    const responseText = result.response.text();
    
    return {
      success: true,
      response: responseText,
      relatedResources: [],
      matchType: "fallback"
    };
    
  } catch (error) {
    console.error("Error handling query:", error);
    return {
      success: false,
      error: `Sorry, I encountered an error while processing your query: ${error.message}`,
      relatedResources: [],
      matchType: "error"
    };
  }
}

module.exports = {
  initializeResourceEmbeddings,
  handleQuery,
  generateEmbeddings,
  preprocessQuery
};