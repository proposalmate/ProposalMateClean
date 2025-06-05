const express = require('express');
const {
  getCheckoutSession,
  getSubscription,
  cancelSubscription,
  resumeSubscription,
  updatePaymentMethod,
  webhook
} = require('../controllers/stripe');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Public webhook route
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

// Protected routes
router.use(protect);
router.get('/checkout-session', getCheckoutSession);
router.get('/subscription', getSubscription);
router.delete('/subscription', cancelSubscription);
router.post('/subscription/resume', resumeSubscription);
router.post('/update-payment-method', updatePaymentMethod);

module.exports = router;
