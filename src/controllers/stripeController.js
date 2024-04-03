// Stripe packages
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SECRET_ENDPOINT;

// Models
const userModel = require("../models/usersModel.js");
const registrationsModel = require("../models/registrationsModel.js");
const registrationTicketsModel = require("../models/registrationTicketsModel.js");

// Function to create a new checkout session
async function createCheckoutSession(req, res) {
  const { tickets, formData } = req.body;
  console.log("formData of /create-checkout-session", formData);
  // console.log("tickets of /create-checkout-session", tickets);
  console.log("✅ Checkout session created!");

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
      metadata: formData,
      /*metadata: {
        formData: JSON.stringify(formData),
        tickets: tickets.map((ticket) => ticket.id).join(","),
      },*/
    });

    res.json({ url: session.url, sessionId: session.id, formData });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Error creating checkout session" });
  }
}

// Handle Stripe webhook
async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log("Event type: ", event.type);
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      const formData = session.metadata; // Access metadata

      // Save user information to the database
      await userModel.saveUser(formData);

      console.log("✅ Checkout session completed!");
    } catch (error) {
      console.error("Error saving user information to the database:", error);
      res.status(500).send("Error handling successful payment");
      return;
    }
  }

  res.send();
}

module.exports = {
  createCheckoutSession,
  handleWebhook,
};
