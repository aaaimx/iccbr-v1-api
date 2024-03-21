const express = require("express");

// Creating a router instance
const router = express.Router();

// Importing the fetchCatalog function from the stripeController module
const { fetchCatalog } = require("../controllers/stripeController");

// Handling GET requests to the '/catalog' endpoint
router.get("/catalog", async (req, res) => {
  try {
    const catalog = await fetchCatalog();
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ error: "Error fetching catalog" });
  }
});

module.exports = router;
