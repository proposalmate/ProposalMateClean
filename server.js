const express = require('express');
const path = require('path');
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

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

// Set proper MIME types for JavaScript files
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pages', express.static(path.join(__dirname, 'public/pages')));
// Serve index.html for the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define explicit routes for known pages instead of using a dynamic parameter
// This avoids potential path-to-regexp parsing errors
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'about.html'));
});

app.get('/features', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'features.html'));
});

app.get('/pricing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'pricing.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'signup.html'));
});

app.get('/templates', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'templates.html'));
});

app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'account.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'dashboard.html'));
});

// API routes
app.use('/api/v1/auth', require('./src/routes/auth'));
app.use('/api/v1/proposals', require('./src/routes/proposals'));

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Serve index.html for any other routes (SPA fallback)
app.get('*', (req, res, next) => {
  // Skip API routes and static files
  if (!req.url.startsWith('/api') && !req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const error = new ErrorResponse(err.message || 'Server Error', err.statusCode || 500);
  res.status(error.statusCode).json({ success: false, error: error.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Static files served from: ${path.join(__dirname, 'public')}`);
});
