const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = 4242;

// CORS setup to allow requests from Live Server (127.0.0.1:5500)
// ✅ CORS fix for local testing — allow all origins
app.use(cors());


// Enable JSON request body parsing
app.use(express.json());

// Endpoint to create Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),

         
   
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://127.0.0.1:5500/success.html',
cancel_url: 'http://127.0.0.1:5500/cancel.html',

    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error); // log full error object
    res.status(500).json({ error: error.message }); // send back error
  }
  
});

// Start the server
app.listen(PORT, () => {
  console.log(`Stripe server running on http://localhost:${PORT}`);
});
