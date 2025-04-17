const Resource = require('../models/Resource');

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.getAllResources();
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get resources by category
exports.getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const resources = await Resource.getResourcesByCategory(category);
    
    if (!resources || resources.length === 0) {
      return res.status(404).json({ message: `No resources found in category: ${category}` });
    }
    
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.getResourceById(parseInt(id));
    
    if (!resource) {
      return res.status(404).json({ message: `Resource with ID ${id} not found` });
    }
    
    res.status(200).json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new resource
exports.createResource = async (req, res) => {
  try {
    const newResource = req.body;
    
    // Simple validation
    if (!newResource.name || !newResource.category) {
      return res.status(400).json({ message: 'Name and category are required fields' });
    }
    
    const resource = await Resource.createResource(newResource);
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a resource
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resourceData = req.body;
    
    const updatedResource = await Resource.updateResource(parseInt(id), resourceData);
    
    if (!updatedResource) {
      return res.status(404).json({ message: `Resource with ID ${id} not found` });
    }
    
    res.status(200).json(updatedResource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Resource.deleteResource(parseInt(id));
    
    if (!success) {
      return res.status(404).json({ message: `Resource with ID ${id} not found` });
    }
    
    res.status(200).json({ message: `Resource with ID ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Resource.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};