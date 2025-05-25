const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config/config');

// @desc    Get Stripe checkout session
// @route   GET /api/v1/stripe/checkout-session
// @access  Private
exports.getCheckoutSession = asyncHandler(async (req, res, next) => {
  // Get user
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Create Stripe customer if not exists
  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name
    });

    user.stripeCustomerId = customer.id;
    await user.save({ validateBeforeSave: false });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: user.stripeCustomerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: config.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${config.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.CLIENT_URL}/pricing`,
    subscription_data: {
      trial_period_days: 7,
    },
    metadata: {
      userId: user._id.toString()
    }
  });

  res.status(200).json({
    success: true,
    sessionId: session.id,
    url: session.url
  });
});

// @desc    Get subscription details
// @route   GET /api/v1/stripe/subscription
// @access  Private
exports.getSubscription = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (!user.subscriptionId) {
    return res.status(200).json({
      success: true,
      data: {
        status: user.subscriptionStatus,
        trialEndDate: user.trialEndDate
      }
    });
  }

  const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);

  res.status(200).json({
    success: true,
    data: {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  });
});

// @desc    Cancel subscription
// @route   DELETE /api/v1/stripe/subscription
// @access  Private
exports.cancelSubscription = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (!user.subscriptionId) {
    return next(new ErrorResponse('No active subscription found', 400));
  }

  // Cancel at period end
  await stripe.subscriptions.update(user.subscriptionId, {
    cancel_at_period_end: true
  });

  res.status(200).json({
    success: true,
    message: 'Subscription will be canceled at the end of the current billing period'
  });
});

// @desc    Resume subscription
// @route   POST /api/v1/stripe/subscription/resume
// @access  Private
exports.resumeSubscription = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (!user.subscriptionId) {
    return next(new ErrorResponse('No active subscription found', 400));
  }

  // Resume subscription
  await stripe.subscriptions.update(user.subscriptionId, {
    cancel_at_period_end: false
  });

  res.status(200).json({
    success: true,
    message: 'Subscription resumed successfully'
  });
});

// @desc    Update payment method
// @route   POST /api/v1/stripe/update-payment-method
// @access  Private
exports.updatePaymentMethod = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  if (!user.stripeCustomerId) {
    return next(new ErrorResponse('No Stripe customer found', 400));
  }

  // Create a SetupIntent to update the payment method
  const setupIntent = await stripe.setupIntents.create({
    customer: user.stripeCustomerId,
    payment_method_types: ['card'],
  });

  res.status(200).json({
    success: true,
    clientSecret: setupIntent.client_secret
  });
});

// @desc    Webhook handler for Stripe events
// @route   POST /api/v1/stripe/webhook
// @access  Public
exports.webhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
});

// Helper functions for webhook events
async function handleCheckoutSessionCompleted(session) {
  if (session.mode === 'subscription') {
    const userId = session.metadata.userId;
    const subscriptionId = session.subscription;

    const user = await User.findById(userId);
    if (user) {
      user.subscriptionId = subscriptionId;
      user.subscriptionStatus = 'trialing'; // Will be updated by subscription.created event
      await user.save({ validateBeforeSave: false });
    }
  }
}

async function handleSubscriptionCreated(subscription) {
  const customer = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customer });

  if (user) {
    user.subscriptionId = subscription.id;
    user.subscriptionStatus = subscription.status;
    user.trialEndDate = new Date(subscription.trial_end * 1000);
    await user.save({ validateBeforeSave: false });
  }
}

async function handleSubscriptionUpdated(subscription) {
  const customer = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customer });

  if (user) {
    user.subscriptionStatus = subscription.status;
    await user.save({ validateBeforeSave: false });
  }
}

async function handleSubscriptionDeleted(subscription) {
  const customer = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customer });

  if (user) {
    user.subscriptionStatus = 'canceled';
    await user.save({ validateBeforeSave: false });
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = subscription.customer;
    const user = await User.findOne({ stripeCustomerId: customer });

    if (user) {
      user.subscriptionStatus = subscription.status;
      await user.save({ validateBeforeSave: false });
    }
  }
}

async function handleInvoicePaymentFailed(invoice) {
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = subscription.customer;
    const user = await User.findOne({ stripeCustomerId: customer });

    if (user) {
      user.subscriptionStatus = subscription.status;
      await user.save({ validateBeforeSave: false });
    }
  }
}
