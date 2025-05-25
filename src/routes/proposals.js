const express = require('express');
const {
  createProposal,
  getProposals,
  getProposal,
  updateProposal,
  deleteProposal,
  generatePDF,
  generateDOCX
} = require('../controllers/proposal');

const router = express.Router();

// Import middleware
const { protect, checkSubscription } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Apply subscription check to all routes except GET routes
router.use('/:id/pdf', checkSubscription);
router.use('/:id/docx', checkSubscription);
router.use(/(POST|PUT|DELETE)/, checkSubscription);

// Routes
router.route('/')
  .get(getProposals)
  .post(createProposal);

router.route('/:id')
  .get(getProposal)
  .put(updateProposal)
  .delete(deleteProposal);

router.get('/:id/pdf', generatePDF);
router.get('/:id/docx', generateDOCX);

module.exports = router;
