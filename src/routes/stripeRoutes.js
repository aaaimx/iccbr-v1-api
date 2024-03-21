const express = require("express");
const router = express.Router();
const { fetchCatalog } = require("../controllers/stripeController");

router.get("/catalog", async (req, res) => {
  try {
    const catalog = await fetchCatalog();
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ error: "Error fetching catalog" });
  }
});

module.exports = router;
