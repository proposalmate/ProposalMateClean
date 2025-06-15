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

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pages', express.static(path.join(__dirname, 'public/pages')));

// Route for root index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define known static page routes
const pageRoutes = [
  'about', 'features', 'pricing', 'login', 'signup',
  'templates', 'account', 'dashboard', 'clients',
  'create', 'create-proposal', 'edit-proposal',
  'proposals', 'reset-password', 'settings', 'subscription',
  'test', 'view-proposal'
];

pageRoutes.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', `${page}.html`));
  });
});

// Redundant explicit route fix (Heroku fails to route /features sometimes)
app.get('/features', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'features.html'));
});

// API routes
app.use('/api/v1/auth', require('./src/routes/auth'));
app.use('/api/v1/proposals', require('./src/routes/proposals'));

// 404 for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Catch-all fallback (for SPA routing etc)
app.get('*', (req, res, next) => {
  if (
    !req.url.startsWith('/api') &&
    !req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)
  ) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const error = new ErrorResponse(err.message || 'Server Error', err.statusCode || 500);
  res.status(error.statusCode).json({ success: false, error: error.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
