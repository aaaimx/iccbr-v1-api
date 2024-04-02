const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SECRET_ENDPOINT;
const bodyParser = require("body-parser");
const router = express.Router();

// Middleware para parsear el cuerpo de la solicitud como JSON
const jsonParser = bodyParser.json();

const {
  fetchTickets,
  handleSuccessfulPayment,
} = require("../controllers/stripe");

// Middleware para parsear el cuerpo de la solicitud solo para rutas específicas
router.use("/create-checkout-session", jsonParser);

// Get all tickets
router.get("/tickets", async (req, res) => {
  try {
    const ticketsList = await fetchTickets();
    res.json(ticketsList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching catalog" });
  }
});

// Create a new checkout session
router.post("/create-checkout-session", async (req, res) => {
  const { tickets, formData } = req.body; // Tickets and customers data
  console.log("formData of /create-checkout-session", formData);

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
          unit_amount: ticket.price * 100,
        },
        quantity: ticket.quantity,
      })),

      mode: "payment",
      success_url: "http://localhost:4321/success",
      cancel_url: "http://localhost:4321/cancel",
    });

    res.json({ url: session.url, sessionId: session.id, formData });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Error creating checkout session" });
  }
});

// Wenhook listener
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
  
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      try {
        const session = event.data.object;
        const customerEmail = session.customer_details.email;
        const customerName = session.customer_details.name;
        const customerAddress = session.customer_details.address;
        // Aquí puedes acceder a más datos del cliente según sea necesario

        // Guardar la información del usuario en la base de datos
        await handleSuccessfulPayment({
          email: customerEmail,
          name: customerName,
          address: customerAddress,
        });
      } catch (error) {
        console.error("Error saving user information to the database:", error);
        res.status(500).send("Error handling successful payment");
        return;
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  }
);

module.exports = router;
