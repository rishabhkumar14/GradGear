
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const resourceRoutes = require('./routes/resourceRoutes');
const aiChatRoutes = require('./routes/aiChatRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const contactRoutes = require('./routes/contactRoutes');
const contributeRoutes = require('./routes/contributeRoutes');
const { responseFormatter } = require('./middleware/responseFormatter');
const serveStatic = require('./middleware/serveStatic');
const aiChatController = require('./controllers/aiChatController');

// Initialize app
const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(morgan(config.server.env === 'production' ? 'combined' : 'dev')); // Logging

// Static files middleware
serveStatic(app);

// Response formatter middleware
app.use(responseFormatter);

// Routes
app.use(`${config.api.prefix}/resources`, resourceRoutes);
app.use(`${config.api.prefix}/chat`, aiChatRoutes);
app.use(`${config.api.prefix}/feedback`, feedbackRoutes);
app.use(`${config.api.prefix}/contact`, contactRoutes);
app.use(`${config.api.prefix}/contribute`, contributeRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GradGear API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Initialize AI chat service
  try {
    await aiChatController.initialize();
  } catch (error) {
    console.error("Failed to initialize AI chat service:", error);
  }
});

module.exports = app;