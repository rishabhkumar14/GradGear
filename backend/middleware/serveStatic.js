const path = require('path');
const express = require('express');
const config = require('../config/config');

// Middleware to serve static files (like images)
const serveStatic = (app) => {
  const imagesPath = path.join(__dirname, '..', config.static.imagesPath);
  app.use('/images', express.static(imagesPath));
  
  // Create the public directory structure if it doesn't exist
  const fs = require('fs');
  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
    console.log(`Created directory: ${imagesPath}`);
  }
};

module.exports = serveStatic;