const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const resourceRoutes = require('./routes/resourceRoutes');
const serveStatic = require('./middleware/serveStatic');
const { responseFormatter } = require("./middleware/responseFormatter");


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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;