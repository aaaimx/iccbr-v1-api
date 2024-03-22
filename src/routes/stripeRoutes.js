const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Importa el objeto stripe

// Creating a router instance
const router = express.Router();

// Importing the fetchTickets function from the stripeController module
const { fetchTickets } = require("../controllers/stripeController");

// Handling GET requests to the '/tickets' endpoint
router.get("/tickets", async (req, res) => {
  try {
    const ticketsList = await fetchTickets();
    res.json(ticketsList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching catalog" });
  }
});

// Post a new Registration
router.post("/create-checkout-session", async (req, res) => {
  const { tickets } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: tickets.map((ticket) => ({
        price_data: {
          currency: ticket.currency,
          product_data: {
            name: ticket.name,
            description: ticket.description,
          },
          unit_amount: ticket.price * 100, // El precio se debe pasar en centavos
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url: "https://localhost:4321/success",
      cancel_url: "https://localhost:4321/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Error creating checkout session" });
  }
});

module.exports = router;
