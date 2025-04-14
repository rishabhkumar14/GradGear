const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

// POST a Feedback
router.post('/', contactController.contactUs);

module.exports = router;