const express = require('express');
const aiChatController = require('../controllers/aiChatController');

const router = express.Router();

/**
 * @route POST /api/chat
 * @desc Process a chat query and return AI-generated response with relevant resources
 * @access Public
 */
router.post('/query', aiChatController.processQuery);

module.exports = router;