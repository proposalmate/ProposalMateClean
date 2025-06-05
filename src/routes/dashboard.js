const express = require('express');
const path = require('path');

// Dashboard routes - these will serve the frontend dashboard application
const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Apply protection to all dashboard routes
router.use(protect);

// Serve dashboard index page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard/index.html'));
});

// Serve dashboard proposal management page
router.get('/proposals', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard/proposals.html'));
});

// Serve dashboard subscription management page
router.get('/subscription', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard/subscription.html'));
});

// Serve dashboard profile page
router.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard/profile.html'));
});

module.exports = router;
