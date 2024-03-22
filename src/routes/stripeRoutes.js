const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Middleware para parsear el cuerpo de la solicitud como JSON
router.use(express.json());

const { fetchTickets } = require("../controllers/stripeController");

router.get("/tickets", async (req, res) => {
  try {
    const ticketsList = await fetchTickets();
    res.json(ticketsList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching catalog" });
  }
});

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
            description: ticket.description || "No description available",
          },
          unit_amount: ticket.price * 100, // El precio se debe pasar en centavos
        },
        quantity: ticket.quantity,
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
