const express = require('express');
const resourceController = require('../controllers/resourceController');

const router = express.Router();

// GET all resources
router.get('/', resourceController.getAllResources);

// GET resources by category
router.get('/category/:category', resourceController.getResourcesByCategory);

// GET all categories
router.get('/categories/', resourceController.getAllCategories);

// GET a single resource by ID
router.get('/:id', resourceController.getResourceById);

// POST a new resource
router.post('/', resourceController.createResource);

// PUT/update a resource
router.put('/:id', resourceController.updateResource);

// DELETE a resource
router.delete('/:id', resourceController.deleteResource);



module.exports = router;