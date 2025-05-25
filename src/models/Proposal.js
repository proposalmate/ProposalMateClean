const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  client: {
    name: {
      type: String,
      required: [true, 'Please add a client name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add a client email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    company: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  projectDetails: {
    description: {
      type: String,
      required: [true, 'Please add a project description']
    },
    scope: {
      type: String
    },
    deliverables: [String],
    timeline: {
      startDate: Date,
      endDate: Date,
      milestones: [{
        title: String,
        date: Date,
        description: String
      }]
    }
  },
  pricing: {
    currency: {
      type: String,
      default: 'GBP'
    },
    total: {
      type: Number,
      required: [true, 'Please add a total price']
    },
    breakdown: [{
      item: String,
      description: String,
      quantity: Number,
      unitPrice: Number,
      amount: Number
    }],
    paymentTerms: {
      type: String
    }
  },
  template: {
    type: String,
    default: 'default'
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected'],
    default: 'draft'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ProposalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Proposal', ProposalSchema);
