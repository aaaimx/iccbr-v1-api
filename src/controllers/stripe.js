// Importing the Stripe package
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Function to fetch all data from a Stripe resource with optional parameters
async function fetchAll(resource, params) {
  try {
    const data = await resource.list(params);
    return data.data;
  } catch (error) {
    console.error("Error fetching data from Stripe:", error);
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
    console.error("Error fetching ticketsList:", error);
    throw new Error("Error fetching ticketsList");
  }
}

// Importar la conexión a la base de datos
const pool = require("../config/database.js");

// Function to handle successful payment and save user data to database
async function handleSuccessfulPayment(formData) {
  console.log("Form Data:", formData);
  try {
    // Extract user information from formData
    const {
      email,
      firstName,
      lastName,
      institution,
      mobileNumber,
      address,
      country,
    } = formData;

    // Insert user information into "users" table
    const query = `
      INSERT INTO users (email, first_name, last_name, institution, mobile_number, address, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE SET
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      institution = excluded.institution,
      mobile_number = excluded.mobile_number,
      address = excluded.address,
      country = excluded.country
    `;
    const values = [
      email,
      firstName,
      lastName,
      institution,
      mobileNumber,
      address,
      country,
    ];

    await pool.query(query, values);

    // You can also perform other actions here, such as updating inventory, sending emails, etc.

    console.log("User information saved successfully to the database.");
  } catch (error) {
    console.error("Error saving user information to the database:", error);
    throw new Error("Error saving user information to the database");
  }
}

module.exports = { fetchTickets, handleSuccessfulPayment };
