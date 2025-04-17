import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Resources API
export const resourcesApi = {
  // Get all resources
  getAllResources: async () => {
    try {
      const response = await api.get('/resources');
      return response.data['Data'];
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Get resources by category
  getResourcesByCategory: async (category) => {
    try {
      const response = await api.get(`/resources/category/${category}`);
      return response.data['Data'];
    } catch (error) {
      console.error(`Error fetching resources for category ${category}:`, error);
      throw error;
    }
  },

  // Get a single resource
  getResourceById: async (id) => {
    try {
      const response = await api.get(`/resources/${id}`);
      return response.data['Data'];
    } catch (error) {
      console.error(`Error fetching resource with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new resource
  createResource: async (resourceData) => {
    try {
      const response = await api.post('/resources', resourceData);
      return response.data['Data'];
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  // Update a resource
  updateResource: async (id, resourceData) => {
    try {
      const response = await api.put(`/resources/${id}`, resourceData);
      return response.data['Data'];
    } catch (error) {
      console.error(`Error updating resource with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a resource
  deleteResource: async (id) => {
    try {
      const response = await api.delete(`/resources/${id}`);
      return response.data['Data'];
    } catch (error) {
      console.error(`Error deleting resource with ID ${id}:`, error);
      throw error;
    }
  },

  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/resources/categories/');
      return response.data['Data'];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

export const abousUsApi = {
  shareFeedback: async (feedback) => {
    try{
      const response = await api.post('/feedback',feedback);
      return response.data['Data'];
    } catch (err) {
      console.log('Error in posting feedback:',err);
      throw err;
    }
  },

  contactUs : async (contactDetails) => {
    try{
      const response = await api.post('/contact',contactDetails);
      return response.data['Data'];
    } catch (err) {
      console.log('Error in posting message:',err);
      throw err;
    }
  }
}

export const contributeApi = {
  suggestCategory: async (categoryDetails) => {
    try{
      const response = await api.post('/contribute/category',categoryDetails);
      return response.data['Data'];
    } catch (err) {
      console.log('Error in suggesting categories:',err);
      throw err;
    }
  },

  suggestResource : async (resourceDetails) => {
    try{
      const response = await api.post('/contribute/resource',resourceDetails);
      return response.data['Data'];
    } catch (err) {
      console.log('Error in suggesting resource:',err);
      throw err;
    }
  }
}

export default api;