const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function fetchAll(resource, params) {
  try {
    const data = await resource.list(params);
    return data.data;
  } catch (error) {
    console.error("Error fetching data from Stripe:", error);
    throw new Error("Error fetching data from Stripe");
  }
}

async function fetchCatalog() {
  try {
    const products = await fetchAll(stripe.products, { active: true });
    const prices = await fetchAll(stripe.prices, { active: true });

    const catalog = products.map((product) => {
      const productPrices = prices.filter(
        (price) => price.product === product.id
      );

      const price = productPrices[0] ? productPrices[0].unit_amount / 100 : 0;
      const currency = productPrices[0] ? productPrices[0].currency : "mxn";

      return {
        id: product.id,
        name: product.name,
        price: price,
        currency: currency,
        description: product.description || "",
      };
    });

    return catalog;
  } catch (error) {
    console.error("Error fetching catalog:", error);
    throw new Error("Error fetching catalog");
  }
}

module.exports = { fetchCatalog };
