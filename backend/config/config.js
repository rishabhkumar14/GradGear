// Load environment variables from .env file
require('dotenv').config();

// Configuration for the backend application
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  
  // Static file serving configuration
  static: {
    imagesPath: process.env.IMAGES_PATH || 'public/images',
  },
  
  // API configuration
  api: {
    prefix: '/api',
  },
};

module.exports = config;