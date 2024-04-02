// Stripe packages
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Models
const userModel = require("../models/usersModel.js");

// Function to fetch all data from a Stripe resource with optional parameters
async function fetchAll(resource, params) {
  try {
    const data = await resource.list(params);
    return data.data;
  } catch (error) {
    console.error("❌ Error fetching data from Stripe:", error);
    throw new Error("Error fetching data from Stripe");
  }
}

// Function to fetch ticketsList data (products and prices) from Stripe
async function fetchTickets() {
  try {
    const tickets = await fetchAll(stripe.products, { active: true });
    const prices = await fetchAll(stripe.prices, { active: true });

    // Mapping products to create a ticketsList array with desired fields
    const ticketsList = tickets.map((product) => {
      // Filtering prices to find the one associated with the current product
      const productPrices = prices.filter(
        (price) => price.product === product.id
      );

      // Extracting price and currency information from the first price
      const price = productPrices[0] ? productPrices[0].unit_amount / 100 : 0;
      const currency = productPrices[0] ? productPrices[0].currency : "mxn";

      // Constructing product object with required fields
      return {
        id: product.id,
        name: product.name,
        price: price,
        currency: currency,
        description: product.description || "",
      };
    });

    // Returning the constructed ticketsList array
    return ticketsList;
  } catch (error) {
    // console.error("Error fetching ticketsList:", error);
    throw new Error("Error fetching ticketsList");
  }
}

// Function to save user data only when successful payment
async function handleSuccessfulPayment(formData) {
  // console.log("formData from saveUser():", formData);
  try {
    await userModel.saveUser(formData);
  } catch (error) {
    console.error("❌ Error saving user information:", error);
    throw new Error("Error saving user information");
  }
}

module.exports = { fetchTickets, handleSuccessfulPayment };
