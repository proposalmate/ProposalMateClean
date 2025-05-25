const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

// Import your backend modules from src folder
const connectDB = require('./src/config/db');
const config = require('./src/config/config');
const ErrorResponse = require('./src/utils/errorResponse');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB using your connection function
connectDB();

// Initialize express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Use morgan logger only in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static frontend files from 'frontend' folder in root
app.use(express.static(path.join(__dirname, 'frontend')));

// Explicitly serve index.html at root path '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// API routes - adjust paths if needed but these should be correct
app.use('/api/v1/auth', require('./src/routes/auth'));
app.use('/api/v1/proposals', require('./src/routes/proposals'));

// 404 handler for API routes (optional, improve UX)
app.use('/api', (req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global error handling middleware placeholder
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// Start the server on configured PORT or default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});
