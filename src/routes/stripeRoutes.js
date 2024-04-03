const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

// Middleware to parse request body as JSON
const jsonParser = bodyParser.json();

// Middleware to parse request body only for specific routes
router.use("/create-checkout-session", jsonParser);

// Create a new checkout session
router.post("/create-checkout-session", stripeController.createCheckoutSession);

// Webhook listener
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeController.handleWebhook
);

module.exports = router;
