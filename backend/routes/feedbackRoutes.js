const express = require('express');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

// POST a Feedback
router.post('/', feedbackController.shareFeedback);

module.exports = router;