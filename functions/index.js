const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY'); // Replace with your real secret key

admin.initializeApp();
const app = express();

// Stripe webhook secret
const endpointSecret = 'whsec_YOUR_WEBHOOK_SECRET'; // Replace with your real webhook secret

// Raw body required for Stripe signature verification
app.use(express.raw({ type: 'application/json' }));

app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Example event handler
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('✅ Checkout Session Completed:', session);
    // Optionally: update Firebase Realtime DB / Firestore here
  }

  res.status(200).send('Webhook received.');
});

// Deploy this Express app as a Firebase Function
exports.stripeWebhook = functions.https.onRequest(app);
