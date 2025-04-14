import api from './api';

/**
 * Service for interacting with the AI chat API
 */
const aiChatService = {
  /**
   * Send a query to the AI chat API and get a response
   * @param {string} query - The user's question or message
   * @returns {Promise<Object>} - Response from the AI including text and related resources
   */
  sendQuery: async (query) => {
    try {
      const response = await api.post('/chat/query', { query });
      return response.data['Data'];
    } catch (error) {
      console.error('Error sending query to AI chat service:', error);
      
      // Return a meaningful error response
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'An unexpected error occurred';
      
      return {
        success: false,
        error: errorMessage,
        relatedResources: []
      };
    }
  }
};

export default aiChatService;