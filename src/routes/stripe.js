const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid");
const endpointSecret =
  "whsec_13ecb0b7c76b9f94f992bb6391eacb9726e76f8f1090884681bfa7aa432a6fbd";
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

  // Genera un identificador único para la transacción
  const transactionId = uuidv4();

  // Almacena temporalmente los datos del formulario junto con el identificador único
  req.session.formData = {
    transactionId,
    ...formData,
  };

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

    res.json({ url: session.url, sessionId: session.id });
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

    // Verificar si el evento es de tipo "checkout.session.completed"
    if (event.type === "checkout.session.completed") {
      try {
        // Obtener el objeto de pago de la sesión de checkout
        const paymentIntent = event.data.object;

        // Obtener el identificador único de la transacción
        const transactionId = paymentIntent.client_reference_id;

        // Recuperar los datos del formulario utilizando el identificador único
        const formData = req.session.formData;

        // Guardar la información del usuario en la base de datos
        await handleSuccessfulPayment(formData);
      } catch (error) {
        console.error("Error handling successful payment:", error);
        res.status(500).send("Error handling successful payment");
        return;
      }
    }

    // Enviar una respuesta 200 para confirmar la recepción del evento
    res.send();
  }
);

module.exports = router;
