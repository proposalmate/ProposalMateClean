const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db'); // db.js should be in /config
const config = require('./src/config/config');
const ErrorResponse = require('./utils/errorResponse'); // Just in case it was missing

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Define routes
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/proposals', require('./routes/proposals'));
app.use('/api/v1/stripe', require('./routes/stripe'));
app.use('/dashboard', require('./routes/dashboard'));

// Serve static frontend from root folder
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, '..', 'css')));
app.use(express.static(path.join(__dirname, '..', 'js')));
app.use(express.static(path.join(__dirname, '..', 'assets')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Send index.html for the root route
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});
// Error handler middleware
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console
  console.error(err);

  // Handle Mongoose errors
  if (err.name === 'CastError') {
    error = new ErrorResponse('Resource not found', 404);
  }

  if (err.code === 11000) {
    error = new ErrorResponse('Duplicate field value entered', 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message.join(', '), 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
});

// Start server
const PORT = config.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;
