// Stripe packages
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function getTickets(req, res) {
  try {
    const tickets = await stripe.products.list({ active: true });
    const prices = await stripe.prices.list({ active: true });

    const ticketsList = tickets.data.map((product) => {
      const productPrice = prices.data.find(
        (price) => price.product === product.id
      );

      const price = productPrice ? productPrice.unit_amount / 100 : 0;
      const currency = productPrice ? productPrice.currency : "mxn";

      return {
        id: product.id,
        name: product.name,
        price: price,
        currency: currency,
        description: product.description || "",
      };
    });

    res.json(ticketsList);
  } catch (error) {
    console.error("❌ Error fetching tickets list:", error);
    res.status(500).json({ error: "Error fetching tickets list" });
  }
}

module.exports = {
  getTickets,
};
