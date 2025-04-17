const aiChatService = require('../services/aiChatService');
const resourcesData = require('../data/resources');

/**
 * Handles AI chat queries
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.processQuery = async (req, res) => {
  const { query } = req.body;
  
  // Basic input validation
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Query is required and must be a non-empty string"
    });
  }
  
  try {
    // Process the query using the AI chat service
    const result = await aiChatService.handleQuery(query, resourcesData);
    
    // Return appropriate response based on success status
    if (result.success) {
      return res.status(200).json({
        success: true,
        response: result.response,
        relatedResources: result.relatedResources,
        matchType: result.matchType
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || "An unknown error occurred",
        matchType: result.matchType
      });
    }
  } catch (error) {
    console.error('Error in AI chat controller:', error);
    return res.status(500).json({
      success: false,
      error: `An error occurred while processing your query: ${error.message}`
    });
  }
};

/**
 * Initialize the AI chat service when the server starts
 */
exports.initialize = async () => {
  try {
    console.log('Initializing AI chat service...');
    await aiChatService.initializeResourceEmbeddings(resourcesData);
    console.log('AI chat service initialized successfully');
  } catch (error) {
    console.error('Error initializing AI chat service:', error);
  }
};