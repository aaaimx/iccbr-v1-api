// Stripe packages
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SECRET_ENDPOINT;

// Nodemailer
const sendEmail = require("../controllers/nodemailerController.js");

// Models
const userModel = require("../models/usersModel.js");
const registrationsModel = require("../models/registrationsModel.js");
const registrationTicketsModel = require("../models/registrationTicketsModel.js");

// Destination Urls
const { clientUrl } = require("../config/config.js");
const successUrl = `${clientUrl}/success`;
const cancelUrl = `${clientUrl}/success`;

// Function to create a new checkout session
async function createCheckoutSession(req, res) {
  const { tickets, formData } = req.body;
  console.log("✅ Checkout session created!");

  try {
    const lineItems = tickets.map((ticket) => ({
      price_data: {
        currency: ticket.currency,
        product_data: {
          name: ticket.name,
          description: ticket.description || "No description available",
        },
        unit_amount: ticket.price * 100,
      },
      quantity: ticket.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        formData: JSON.stringify(formData),
        tickets: JSON.stringify(tickets), // Ensure tickets are properly formatted
      },
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

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      const formData = JSON.parse(session.metadata.formData);
      const tickets = JSON.parse(session.metadata.tickets);

      // console.log("Tickets recieved from checkout session:", tickets);

      // Save user information
      await userModel.saveUser(formData);

      // Save registration information
      const { registrationId } = await registrationsModel.saveRegistration(
        formData
      );

      // Save tickets information
      for (const ticket of tickets) {
        await registrationTicketsModel.saveRegistrationTicket(
          registrationId,
          ticket
        );
      }

      // Send email registration information
      await sendEmail.sendRegistrationEmail(formData, tickets, registrationId);

      console.log("✅ Checkout session completed!");
    } catch (error) {
      console.error("Error saving information to the database:", error);
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
