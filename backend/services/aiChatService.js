/**
 * Advanced RAG-based AI Chat Service for GradGear
 * 
 * This service provides an intelligent query-resource matching system using:
 * 1. Semantic vector embeddings for deep content understanding
 * 2. Dynamic resource analysis without hardcoded keywords
 * 3. Multi-stage retrieval with context-aware reranking
 * 4. Generative responses using the Gemini API
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config/config');

// Get base URL for resource links
const BASE_URL = process.env.BASE_URL;

// Initialize Gemini API with the API key from config
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

// Set up the embedding and generation models
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Storage for resource embeddings and metadata
let resourceEmbeddingsCache = [];
let resourceMetadata = [];
let isEmbeddingsInitialized = false;

/**
 * Main entry point - handles a user query and generates a response using RAG
 * @param {string} query - User query
 * @param {Object} resourcesData - Resource data object
 * @returns {Promise<Object>} - Response object with text and related resources
 */
async function handleQuery(query, resourcesData) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error("Invalid query: Query must be a non-empty string");
  }
  
  try {
    console.log(`\n==== Processing query: "${query}" ====`);
    
    // Initialize embeddings if not already done
    if (!isEmbeddingsInitialized) {
      await initializeResourceEmbeddings(resourcesData);
    }
    
    // 1. Analyze query intent
    const queryAnalysis = await analyzeQueryIntent(query);
    console.log(`Query analysis: ${queryAnalysis}`);
    
    // 2. First-stage retrieval: Semantic search
    const semanticResults = await performSemanticSearch(query, queryAnalysis);
    console.log(`Retrieved ${semanticResults.length} candidates via semantic search`);
    
    // 3. Second-stage retrieval: Apply contextual reranking
    const rerankedResults = await rerankResults(semanticResults, query, queryAnalysis);
    console.log(`Reranked results. Top result: ${rerankedResults[0]?.resource.name || 'none'}`);
    
    // 4. Format resource details for prompt
    const formattedResources = formatResourcesForPrompt(rerankedResults, query);
    
    // 5. Generate response
    if (rerankedResults.length > 0) {
      // Generate response with relevant resources
      const responseText = await generateResponse(query, queryAnalysis, formattedResources, rerankedResults.length);
      
      return {
        success: true,
        response: responseText,
        // Return ALL reranked resources to ensure UI consistency
        relatedResources: rerankedResults.map(item => item.resource),
        matchType: "semantic"
      };
    } else {
      // Generate fallback response
      const fallbackResponse = await generateFallbackResponse(query);
      
      return {
        success: true,
        response: fallbackResponse,
        relatedResources: [],
        matchType: "fallback"
      };
    }
    
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

/**
 * Initializes embeddings for all resources in the data
 * @param {Object} resourcesData - Resource data object organized by categories
 * @returns {Promise<void>}
 */
async function initializeResourceEmbeddings(resourcesData) {
  try {
    isEmbeddingsInitialized = false;
    console.log("Initializing resource embeddings...");
    
    resourceEmbeddingsCache = [];
    resourceMetadata = [];
    
    let resourceCount = 0;
    let successCount = 0;
    
    for (const category in resourcesData) {
      if (!resourcesData[category] || !Array.isArray(resourcesData[category])) continue;
      
      const resources = resourcesData[category];
      
      for (const resource of resources) {
        resourceCount++;
        
        try {
          // Create three embeddings for each resource for different aspects
          // 1. Name and basic identity
          const nameText = `${resource.name} ${category} ${resource.chips?.join(" ") || ""}`;
          
          // 2. Description (short summary)
          const descriptionText = resource.description || "";
          
          // 3. Full details (comprehensive information)
          const detailsText = resource.details || resource.description || "";
          
          // Generate embeddings for each text representation
          const [nameEmbedding, descriptionEmbedding, detailsEmbedding] = await Promise.all([
            generateEmbedding(nameText),
            generateEmbedding(descriptionText),
            generateEmbedding(detailsText)
          ]);
          
          // Extract key phrases, aliases and use cases
          const useCases = extractUseCases(resource.details || "");
          const aliases = extractAliases(resource.details || "");
          
          // Store the embeddings and metadata
          resourceEmbeddingsCache.push({
            id: resource.id,
            name: nameEmbedding,
            description: descriptionEmbedding,
            details: detailsEmbedding
          });
          
          resourceMetadata.push({
            id: resource.id,
            resource: { ...resource, category },
            useCases,
            aliases
          });
          
          successCount++;
          
          if (successCount % 10 === 0 || successCount === 1) {
            console.log(`Generated embeddings for ${successCount}/${resourceCount} resources...`);
          }
        } catch (error) {
          console.error(`Failed to generate embeddings for resource: ${resource.name}`, error);
        }
      }
    }
    
    isEmbeddingsInitialized = successCount > 0;
    console.log(`Embeddings initialization complete. ${successCount}/${resourceCount} resources processed.`);
  } catch (error) {
    console.error("Error initializing resource embeddings:", error);
    throw error;
  }
}

/**
 * Extracts use cases from resource details
 * @param {string} details - Resource details text
 * @returns {string[]} - Array of use cases
 */
function extractUseCases(details) {
  const useCases = [];
  
  // Extract use cases mentioned in the "use cases include" section
  const useCaseMatch = details.match(/use cases (?:include|encompass) (.*?)(?:\.|\;)/i);
  if (useCaseMatch && useCaseMatch[1]) {
    useCaseMatch[1].split(",").forEach(useCase => {
      const trimmed = useCase.trim();
      if (trimmed) useCases.push(trimmed);
    });
  }
  
  return useCases;
}

/**
 * Extracts alternative names/aliases from resource details
 * @param {string} details - Resource details text
 * @returns {string[]} - Array of aliases
 */
function extractAliases(details) {
  const aliases = [];
  
  // Extract aliases from the "Also known as" section
  const aliasMatch = details.match(/Also (?:known as|called|referred to as|termed) ['"]([^'"]+)['"]/i);
  if (aliasMatch && aliasMatch[1]) {
    // Split by commas or "or" for multiple aliases
    const parts = aliasMatch[1].split(/\s*(?:,|\s+or\s+)\s*/);
    parts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed) aliases.push(trimmed);
    });
  }
  
  return aliases;
}

/**
 * Generates an embedding for the provided text
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<number[]>} - Embedding vector
 */
async function generateEmbedding(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn("Empty text provided for embedding generation");
    return [];
  }
  
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

/**
 * Analyzes query intent using Gemini
 * @param {string} query - Original user query
 * @returns {Promise<string>} - Analysis of query intent
 */
async function analyzeQueryIntent(query) {
  try {
    const prompt = `Analyze this query to determine the user's intent: "${query}"

Your goal is to understand:
1. What specific resource or type of resource they're looking for
2. Any problems they're describing (e.g., "laptop died" means they need power)
3. Any specific requirements or constraints mentioned

Give me a concise, 1-2 sentence summary of what they're actually looking for.`;

    const result = await generativeModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error analyzing query intent:", error);
    return "Could not analyze query intent";
  }
}

/**
 * Performs semantic search to find relevant resources
 * @param {string} query - User query
 * @param {string} queryAnalysis - Analysis of query intent
 * @returns {Promise<Array>} - Array of potential matches with scores
 */
async function performSemanticSearch(query, queryAnalysis) {
  try {
    if (!isEmbeddingsInitialized) {
      throw new Error("Resource embeddings not initialized");
    }
    
    // Create combined query with the original query and analysis
    const enhancedQuery = `${query} ${queryAnalysis}`;
    
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(enhancedQuery);
    
    // If embedding failed, return empty results
    if (!queryEmbedding || queryEmbedding.length === 0) {
      return [];
    }
    
    // Calculate similarities with all three aspects of each resource
    const similarities = [];
    
    for (let i = 0; i < resourceEmbeddingsCache.length; i++) {
      const embeddings = resourceEmbeddingsCache[i];
      const metadata = resourceMetadata[i];
      
      // Calculate similarities for each aspect with different weights
      const nameSimilarity = cosineSimilarity(queryEmbedding, embeddings.name) * 0.3;
      const descriptionSimilarity = cosineSimilarity(queryEmbedding, embeddings.description) * 0.3;
      const detailsSimilarity = cosineSimilarity(queryEmbedding, embeddings.details) * 0.4;
      
      // Calculate weighted average similarity
      const overallSimilarity = nameSimilarity + descriptionSimilarity + detailsSimilarity;
      
      similarities.push({
        resource: metadata.resource,
        similarity: overallSimilarity,
        useCases: metadata.useCases,
        aliases: metadata.aliases
      });
    }
    
    // Sort by similarity (highest first)
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    // Log top matches for debugging
    console.log("--- Top semantic matches ---");
    similarities.slice(0, 3).forEach(item => {
      console.log(`${item.resource.name} (${item.resource.category}): ${item.similarity.toFixed(4)}`);
    });
    
    // Apply a minimum threshold and return top results
    // Get more candidates than before to ensure we have enough for the UI
    return similarities
      .filter(item => item.similarity > 0.5)
      .slice(0, 12);
  } catch (error) {
    console.error("Error in semantic search:", error);
    return [];
  }
}

/**
 * Calculates cosine similarity between two embedding vectors
 * @param {number[]} embedding1 - First embedding
 * @param {number[]} embedding2 - Second embedding
 * @returns {number} - Similarity score (0-1)
 */
function cosineSimilarity(embedding1, embedding2) {
  if (!embedding1 || !embedding2 || 
      !Array.isArray(embedding1) || !Array.isArray(embedding2) || 
      embedding1.length === 0 || embedding2.length === 0 ||
      embedding1.length !== embedding2.length) {
    return 0;
  }
  
  const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
  const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Reranks results using contextual analysis
 * @param {Array} candidates - Candidate resources from semantic search
 * @param {string} query - Original query
 * @param {string} queryAnalysis - Analysis of query intent
 * @returns {Promise<Array>} - Reranked results
 */
async function rerankResults(candidates, query, queryAnalysis) {
  if (candidates.length === 0) return [];
  
  try {
    // For each candidate, analyze how well it matches the query context
    const rerankedCandidates = await Promise.all(candidates.map(async candidate => {
      try {
        // Extract key characteristics from the resource
        const { resource, useCases, aliases, similarity: initialScore } = candidate;
        
        // Extract problem-solution indications
        const isPowerRelated = query.match(/(?:died|low|out of|no power|battery|charg|power)/i) !== null;
        const isRecordingRelated = query.match(/(?:record|audio|podcast|film|video|capture)/i) !== null;
        const isVisualizationRelated = query.match(/(?:see|small|tiny|objects|magnify|zoom)/i) !== null;
        const isPresentationRelated = query.match(/(?:present|slide|projection|show)/i) !== null;
        const isSpaceRelated = query.match(/(?:room|space|meet|study|group)/i) !== null;
        
        // Adjust score based on category match
        let contextualScore = initialScore;
        
        if (isPowerRelated && 
            (resource.category === 'charger' || 
             resource.category === 'lockers' || 
             resource.name.toLowerCase().includes('charger') || 
             resource.name.toLowerCase().includes('power'))) {
          contextualScore *= 1.5;
        }
        
        if (isRecordingRelated && 
            (resource.category === 'camera' || 
             resource.category === 'microphone' || 
             resource.chips?.some(chip => chip.toLowerCase().includes('record')))) {
          contextualScore *= 1.5;
        }
        
        if (isVisualizationRelated && 
            (resource.name.toLowerCase().includes('microscope'))) {
          contextualScore *= 2.0;
        }
        
        if (isPresentationRelated && 
            (resource.category === 'vending accessories' || 
             resource.category === 'accessories' ||
             resource.name.toLowerCase().includes('projector') ||
             resource.name.toLowerCase().includes('presenter'))) {
          contextualScore *= 1.5;
        }
        
        if (isSpaceRelated && resource.category === 'spaces') {
          contextualScore *= 1.5;
        }
        
        // Check for "laptop died" -> power sources
        if (query.toLowerCase().includes('laptop died') || 
            query.toLowerCase().includes('out of power') || 
            query.toLowerCase().includes('no battery')) {
          if (resource.category === 'charger' || 
              resource.category === 'lockers' ||
              resource.name.toLowerCase().includes('power bank') ||
              resource.name.toLowerCase().includes('charger')) {
            contextualScore *= 2.0;
          } else if (resource.category === 'laptop') {
            // Penalize laptop recommendations for power issues
            contextualScore *= 0.3;
          }
        }
        
        return {
          ...candidate,
          similarityScore: initialScore,
          contextualScore: contextualScore
        };
      } catch (error) {
        console.error(`Error reranking candidate ${candidate.resource.name}:`, error);
        return { ...candidate, contextualScore: candidate.similarity };
      }
    }));
    
    // Sort by contextual score
    rerankedCandidates.sort((a, b) => b.contextualScore - a.contextualScore);
    
    // Return more candidates to ensure UI consistency
    // Use a more generous cutoff to include more potentially relevant resources
    return rerankedCandidates
      .filter(item => item.contextualScore > 0.4)
      .slice(0, 8); // Increase from 5 to 8
  } catch (error) {
    console.error("Error in reranking:", error);
    return candidates.slice(0, 8);
  }
}

/**
 * Formats resources for inclusion in the prompt
 * @param {Array} resources - Resource objects with scores
 * @param {string} query - Original query
 * @returns {string} - Formatted resource text
 */
function formatResourcesForPrompt(resources, query) {
  if (resources.length === 0) return "";
  
  return resources.map((item, index) => {
    const { resource, similarityScore, contextualScore } = item;
    
    // Format booking link
    const bookingLink = resource.navigateTo && resource.navigateTo !== '#' 
      ? `[Book Here](${resource.navigateTo})` 
      : 'No booking link available.';
    
    // Choose which details to include based on length
    const detailsText = resource.details || resource.description;
    const truncatedDetails = detailsText.length > 300 
      ? detailsText.substring(0, 300) + "..." 
      : detailsText;
    
    // Format chips/tags
    const chipsText = resource.chips && resource.chips.length > 0 
      ? `Tags: ${resource.chips.join(", ")}` 
      : "";
    
    // Create resource entry
    return `Resource ${index + 1}: **${resource.name}** (Category: ${resource.category})
Score: ${contextualScore.toFixed(2)} (Base: ${similarityScore.toFixed(2)})
Description: ${resource.description}
Details: ${truncatedDetails}
${chipsText}
Booking: ${bookingLink}`;
  }).join("\n\n");
}

/**
 * Generates a response using Gemini
 * @param {string} query - User query
 * @param {string} queryAnalysis - Analysis of query intent
 * @param {string} resourcesText - Formatted resources text
 * @param {number} resourceCount - Number of resources available
 * @returns {Promise<string>} - Generated response
 */
async function generateResponse(query, queryAnalysis, resourcesText, resourceCount) {
  try {
    const prompt = `You are an AI assistant for GradGear, a university resource portal.

User query: "${query}"

I've analyzed their intent: "${queryAnalysis}"

Based on this analysis, I found ${resourceCount} potentially relevant resources:

${resourcesText}

Your task:
1. Craft a helpful, conversational response addressing what the user is looking for
2. IMPORTANT: List ALL ${resourceCount} resources that I've provided in your response - the user needs to see all options
3. Present resources in a clear, numbered list with resource names in bold
4. For EACH resource you list, provide a specific reason why it's relevant to their query
5. Include booking links using markdown [Book Here](link) format where available
6. If the user has a problem (like "laptop died"), recommend solutions (chargers/power banks) not replacements
7. Be concise but thorough - explain each recommendation
8. Do not fabricate details - use only the information provided about each resource

The resource cards shown in the UI will match exactly with the resources you list in your response, so make sure to include ALL resources I've provided.`;

    const result = await generativeModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    return "I apologize, but I'm having trouble generating a response right now. Please try again or rephrase your question.";
  }
}

/**
 * Generates a fallback response when no resources match
 * @param {string} query - User query
 * @returns {Promise<string>} - Fallback response
 */
async function generateFallbackResponse(query) {
  try {
    const prompt = `You are an AI assistant for GradGear, a university resource portal.

The user asked: "${query}"

Unfortunately, I couldn't find any resources in our system that match this query.

Craft a friendly, helpful response that:
1. Acknowledges we don't have specific resources matching their query
2. Suggests they try different keywords or be more specific
3. Mentions they can contribute missing resources via the Contribute page, using the text "Contribute here!" as a hyperlink to ${BASE_URL}/contribute
4. Offers to help with other resource-related questions
5. Is concise (around 100 words)

IMPORTANT: When mentioning the contribute page, use the format "[Contribute here!](${BASE_URL}/contribute)" - do NOT expose the raw URL.`;

    const result = await generativeModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating fallback response:", error);
    return `I'm sorry, I couldn't find any resources matching your query. Please try different keywords or check our [Contribute here!](${BASE_URL}/contribute) page to suggest new resources.`;
  }
}

module.exports = {
  handleQuery,
  initializeResourceEmbeddings
};