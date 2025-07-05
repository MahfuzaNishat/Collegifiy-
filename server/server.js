const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
console.log("Loaded Stripe Key:", process.env.STRIPE_SECRET_KEY);


const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


app.use(cors());
app.use(express.json());

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
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:5500/html/success.html',
      cancel_url: 'http://localhost:5500/html/cancel.html',
    });

    res.json({ url: session.url }); // ✅ send the redirect URL
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Stripe server running on http://localhost:${PORT}`));
