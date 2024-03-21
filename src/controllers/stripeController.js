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

// Function to fetch catalog data (products and prices) from Stripe
async function fetchCatalog() {
  try {
    const products = await fetchAll(stripe.products, { active: true });
    const prices = await fetchAll(stripe.prices, { active: true });

    // Mapping products to create a catalog array with desired fields
    const catalog = products.map((product) => {
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

    // Returning the constructed catalog array
    return catalog;
  } catch (error) {
    console.error("Error fetching catalog:", error);
    throw new Error("Error fetching catalog");
  }
}

module.exports = { fetchCatalog };
