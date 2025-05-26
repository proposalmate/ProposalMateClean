const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./src/config/db');
const config = require('./src/config/config');
const ErrorResponse = require('./src/utils/errorResponse');

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

// Serve static frontend files from 'Frontend' folder (capital F)
app.use(express.static(path.join(__dirname, 'Frontend')));

// Explicitly serve index.html at root path '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// API routes
app.use('/api/v1/auth', require('./src/routes/auth'));
app.use('/api/v1/proposals', require('./src/routes/proposals'));

// 404 handler for API routes (optional)
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  const error = new ErrorResponse(err.message || 'Server Error', err.statusCode || 500);
  res.status(error.statusCode).json({ success: false, error: error.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
