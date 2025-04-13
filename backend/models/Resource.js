// Import the data (initially from a local file, later could be migrated to a database)
let resourcesData = require('../data/resources');

// Helper function to find a resource by ID
const findResourceById = (id) => {
  // Flatten all resources from categories into a single array
  const allResources = Object.values(resourcesData).flat();
  return allResources.find(resource => resource.id === id);
};

// Helper function to find the category of a resource
const findCategoryById = (id) => {
  for (const [category, resources] of Object.entries(resourcesData)) {
    if (resources.some(resource => resource.id === id)) {
      return category;
    }
  }
  return null;
};

// Get the next available ID
const getNextId = () => {
  const allResources = Object.values(resourcesData).flat();
  return Math.max(...allResources.map(resource => resource.id), 0) + 1;
};

const ResourceModel = {
  // Get all resources as an object with categories as keys
  getAllResources: async () => {
    return resourcesData;
  },

  // Get resources by category
  getResourcesByCategory: async (category) => {
    return resourcesData[category] || [];
  },

  // Get a single resource by ID
  getResourceById: async (id) => {
    return findResourceById(id);
  },

  // Create a new resource
  createResource: async (resourceData) => {
    const newResource = {
      id: getNextId(),
      ...resourceData
    };

    const category = resourceData.category.toLowerCase();
    
    // Create category if it doesn't exist
    if (!resourcesData[category]) {
      resourcesData[category] = [];
    }
    
    resourcesData[category].push(newResource);
    return newResource;
  },

  // Update a resource
  updateResource: async (id, resourceData) => {
    const resource = findResourceById(id);
    if (!resource) return null;

    const category = findCategoryById(id);
    
    // Remove from original category
    resourcesData[category] = resourcesData[category].filter(r => r.id !== id);
    
    // If category is changing, add to new category
    const updatedResource = { ...resource, ...resourceData };
    const newCategory = resourceData.category ? resourceData.category.toLowerCase() : category;
    
    if (!resourcesData[newCategory]) {
      resourcesData[newCategory] = [];
    }
    
    resourcesData[newCategory].push(updatedResource);
    return updatedResource;
  },

  // Delete a resource
  deleteResource: async (id) => {
    const category = findCategoryById(id);
    if (!category) return false;
    
    const initialLength = resourcesData[category].length;
    resourcesData[category] = resourcesData[category].filter(r => r.id !== id);
    
    return resourcesData[category].length < initialLength;
  },

  // Get all categories
  getAllCategories: async () => {
    return Object.keys(resourcesData);
  }
};

module.exports = ResourceModel;