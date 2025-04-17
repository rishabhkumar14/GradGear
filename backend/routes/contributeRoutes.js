const express = require('express');
const contributeController = require('../controllers/contributeController');

const router = express.Router();

// POST a category
router.post('/category', contributeController.suggestCategory);

// POST a resource
router.post('/resource', contributeController.suggestResource);

module.exports = router;