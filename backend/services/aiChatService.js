const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config/config');

const BASE_URL = process.env.BASE_URL;

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
 * Extracts and flattens all relevant text data from a resource for improved semantic search
 * @param {Object} resource - Resource object
 * @param {string} category - Resource category
 * @returns {string} - Flattened text representation
 */
function extractResourceText(resource, category) {
  const parts = [];
  
  // Add basic information
  parts.push(resource.name || '');
  parts.push(category || '');
  parts.push(resource.description || '');
  
  // Add detailed information
  parts.push(resource.details || '');
  
  // Add chips (tags)
  if (resource.chips && Array.isArray(resource.chips)) {
    parts.push(resource.chips.join(' '));
  }
  
  // Add locations
  if (resource.locations && Array.isArray(resource.locations)) {
    parts.push(resource.locations.join(' '));
  }
  
  // Add any other relevant fields
  if (resource.duration) parts.push(resource.duration);
  
  // Return the flattened text representation, removing extra whitespace
  return parts.join(' ').trim().replace(/\s+/g, ' ');
}

/**
 * Generates intents from resources by extracting common use cases and key terms
 * @param {Object} resourcesData - Resource data object organized by categories
 * @returns {Object} - Intent dictionary with potential query patterns and categories
 */
function generateIntentDictionary(resourcesData) {
  const intentDict = {};
  
  // Extract intents from each resource
  for (const category in resourcesData) {
    const resources = resourcesData[category];
    if (!Array.isArray(resources)) continue;
    
    for (const resource of resources) {
      // Extract common names/aliases from the "Also known as" section in details
      if (resource.details) {
        const alsoKnownMatch = resource.details.match(/Also (?:known as|called|referred to as|termed) ['"](.*?)['"],(?:.*?)or ['"](.*?)['"];/i);
        if (alsoKnownMatch) {
          const alternateNames = [alsoKnownMatch[1], alsoKnownMatch[2]].filter(Boolean);
          alternateNames.forEach(name => {
            if (name && name.length > 3) { // Only use meaningful alternate names
              intentDict[name.toLowerCase()] = category;
            }
          });
        }
        
        // Extract use cases from the details text
        const useCasesMatch = resource.details.match(/use cases (?:include|encompass|cover) (.*?)(?:;|\.)/i);
        if (useCasesMatch && useCasesMatch[1]) {
          const useCases = useCasesMatch[1].split(',').map(useCase => useCase.trim());
          useCases.forEach(useCase => {
            const keywords = useCase.toLowerCase()
              .replace(/ing\b/g, '') // Remove trailing -ing to match different forms
              .split(/\s+/)
              .filter(word => word.length > 3); // Only use meaningful keywords
              
            keywords.forEach(keyword => {
              if (!intentDict[keyword]) {
                intentDict[keyword] = category;
              }
            });
          });
        }
      }
      
      // Add resource name and potential semantic variations
      const nameWords = resource.name.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      nameWords.forEach(word => {
        intentDict[word] = category;
      });
      
      // Add chips as potential intents
      if (resource.chips && Array.isArray(resource.chips)) {
        resource.chips.forEach(chip => {
          if (chip.length > 3) {
            intentDict[chip.toLowerCase()] = category;
          }
        });
      }
    }
  }
  
  // Add common problem/solution mappings (extracted from use cases and problems the resources solve)
  const problemSolutionMap = {
    "died": ["charger", "power bank", "lockers"],
    "no power": ["charger", "power bank", "lockers"],
    "charging": ["charger", "power bank", "lockers"],
    "battery": ["charger", "power bank", "lockers"],
    "out of power": ["charger", "power bank", "lockers"],
    "battery low": ["charger", "power bank", "lockers"],
    "dead laptop": ["charger", "power bank", "lockers"],
    "needs power": ["charger", "power bank", "lockers"],
    "ran out": ["charger", "power bank", "lockers"],
    "small": ["accessories", "camera"],
    "tiny": ["accessories"],
    "microscopic": ["accessories"],
    "record": ["microphone"],
    "audio": ["microphone"],
    "podcast": ["microphone"],
    "film": ["camera", "vending accessories"],
    "video": ["camera", "vending accessories"],
    "present": ["vending accessories", "accessories"],
    "slides": ["vending accessories"],
    "meeting": ["spaces"],
    "group": ["spaces"],
    "study": ["spaces"],
    "compute": ["working with gpus"],
    "learning": ["working with gpus"],
    "ai": ["working with gpus"],
    "model": ["working with gpus"]
  };
  
  // Merge problem solution map into intent dictionary
  for (const [problem, categories] of Object.entries(problemSolutionMap)) {
    categories.forEach(category => {
      intentDict[problem] = category;
    });
  }
  
  return intentDict;
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
      
      // Create rich text representation using the enhanced extraction function
      const text = extractResourceText(resource, category);
      
      if (!text) {
        console.warn(`Skipping resource "${resource.name}" (Category: ${category}) due to empty text`);
        continue;
      }

      try {
        const embedding = await generateEmbeddings(text);
        // Add embedding, original category, and text representation to the resource object
        tempResourceList.push({ ...resource, category, embedding, textRepresentation: text });
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
async function findSimilarResources(query, threshold = 0.6, maxResults = 5) {
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
 * Analyzes a user query for known intents or problems
 * @param {string} query - User query
 * @param {Object} intentDict - Intent dictionary
 * @returns {Array} - Array of potential category matches
 */
function analyzeQueryIntent(query, intentDict) {
  const processedQuery = preprocessQuery(query.toLowerCase());
  const queryWords = processedQuery.split(/\s+/);
  const matches = [];
  
  // Look for multi-word matches first
  for (const key of Object.keys(intentDict)) {
    if (key.includes(' ') && processedQuery.includes(key)) {
      matches.push({
        intent: key,
        category: intentDict[key],
        score: 1.0 // Direct match gets highest score
      });
    }
  }
  
  // Then check for single word matches
  if (matches.length === 0) {
    for (const word of queryWords) {
      if (intentDict[word]) {
        matches.push({
          intent: word,
          category: intentDict[word],
          score: 0.8 // Single word match gets lower score
        });
      }
    }
  }
  
  // Also check for partial matches for common problems
  if (matches.length === 0) {
    const commonProblems = [
      { patterns: ["out of power", "no battery", "dead battery", "low battery"], categories: ["charger", "lockers"] },
      { patterns: ["need to record", "make video", "capture video"], categories: ["camera", "vending accessories"] },
      { patterns: ["small objects", "see small", "magnify"], categories: ["accessories"] },
      { patterns: ["present", "slides", "presentation"], categories: ["vending accessories", "accessories"] },
      { patterns: ["study group", "meeting space", "group work"], categories: ["spaces"] }
    ];
    
    for (const problem of commonProblems) {
      for (const pattern of problem.patterns) {
        if (processedQuery.includes(pattern) || query.toLowerCase().includes(pattern)) {
          problem.categories.forEach(category => {
            matches.push({
              intent: pattern,
              category: category,
              score: 0.9 // Problem pattern match gets high score
            });
          });
        }
      }
    }
  }
  
  // Sort by score
  matches.sort((a, b) => b.score - a.score);
  
  // Return unique categories
  const uniqueCategories = [...new Set(matches.map(m => m.category))];
  return uniqueCategories;
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
    
    // Generate intent dictionary from resources
    const intentDict = generateIntentDictionary(resourcesData);
    
    // Preprocess the query
    const processedQuery = preprocessQuery(query);
    console.log(`Original query: "${query}"`);
    console.log(`Processed query: "${processedQuery}"`);
    
    // Analyze query for intents and problems
    const potentialCategories = analyzeQueryIntent(query, intentDict);
    console.log(`Potential categories based on intent analysis: ${potentialCategories.join(', ')}`);
    
    let matchedResources = [];
    let matchType = "none";
    
    // If we have category matches from intent analysis, use those
    if (potentialCategories.length > 0) {
      matchType = "intent";
      
      for (const category of potentialCategories) {
        // Get resources from the matched category
        if (resourcesData[category]) {
          const categoryResources = resourcesData[category];
          console.log(`Found ${categoryResources.length} resources in category: ${category}`);
          
          // Add resources from this category
          matchedResources = [...matchedResources, ...categoryResources.map(resource => ({ 
            resource: { ...resource, category }, 
            score: 0.9 // High score for intent-based matching
          }))];
        }
      }
      
      // Further refine within the matched categories using semantic search
      if (matchedResources.length > 0) {
        try {
          // Create an embedding for the query
          const queryEmbedding = await generateEmbeddings(query);
          
          // Calculate similarity for each matched resource
          matchedResources = matchedResources.map(item => {
            // Generate embedding if not already in cache
            const cachedResource = resourceEmbeddingsCache.find(r => r.id === item.resource.id);
            if (cachedResource) {
              const similarity = cosineSimilarity(queryEmbedding, cachedResource.embedding);
              return { 
                resource: item.resource, 
                similarity,
                // Combine intent score with similarity score, weighted towards intent
                score: (item.score * 0.7) + (similarity * 0.3)
              };
            }
            return item;
          });
          
          // Sort by combined score
          matchedResources.sort((a, b) => b.score - a.score);
          
          // Limit to top results
          matchedResources = matchedResources.slice(0, 5);
          
          console.log(`Refined to ${matchedResources.length} resources using semantic search`);
        } catch (error) {
          console.warn("Error refining with semantic search, using intent matches only:", error.message);
        }
      }
    }
    
    // If no matches found via intent analysis, use pure semantic search
    if (matchedResources.length === 0) {
      console.log("No intent matches found, using semantic search...");
      const similarResults = await findSimilarResources(query);
      
      if (similarResults.length > 0) {
        matchType = "semantic";
        matchedResources = similarResults;
        console.log(`Found ${matchedResources.length} semantically similar resources`);
      }
    }
    
    // If we have matches from either method, format and return them
    if (matchedResources.length > 0) {
      // Format resources for the prompt
      const resourceDetails = matchedResources
        .map((item, index) => {
          const resource = item.resource;
          const score = item.similarity || item.score;
          const scoreDisplay = score ? score.toFixed(2) : 'N/A';
          
          // If a booking link exists and is not just a placeholder, show as a Markdown link
          const bookingLink = resource.navigateTo && resource.navigateTo !== '#' 
            ? `[Book Here!](${resource.navigateTo})` 
            : 'No booking link available.';
          
          return `${index + 1}. **${resource.name}** (Category: ${resource.category}${score ? `, Relevance: ${scoreDisplay}` : ''}):
             Description: ${resource.description}
             Details: ${resource.details ? resource.details.slice(0, 250) + "..." : 'No details available.'}
             Booking Link: ${bookingLink}`;
        })
        .join("\n\n");
      
      const prompt = `You are a helpful assistant for GradGear, a university resource portal.
Carefully analyze the user's query: "${query}"

Based on analysis, I found these potentially relevant resources:
${resourceDetails}

Your task is to:
1. Determine which resources TRULY match what the user is looking for, considering both explicit and implicit needs
2. If the user describes a problem (like "laptop died"), identify what they actually need (like a charger, not a new laptop)
3. Only include resources that directly address their need - don't include irrelevant options
4. Use the full resource details to understand each resource's purpose and capabilities
5. Be conversational and helpful in your response
6. Present the MOST RELEVANT resources first in a clear Markdown list
7. Use bold (**Resource Name**) for resource names
8. Include booking links where available
9. Briefly explain why each resource is relevant to their specific query
10. Aim for 150-200 words maximum
11. Err on the side of suggestion related resources in unclear cases

Your goal is to truly understand what the user needs (even if they express it vaguely) and provide the most helpful suggestions.`;

      const result = await generativeModel.generateContent(prompt);
      const responseText = result.response.text();
      
      return {
        success: true,
        response: responseText,
        relatedResources: matchedResources.map(item => item.resource),
        matchType
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
3. Mentions they can contribute missing resources via the Contribute page. The link for the contribute page is [Contribute page](${BASE_URL}/contribute).
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
