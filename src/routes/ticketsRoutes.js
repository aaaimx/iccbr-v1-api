const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/ticketsController");

// Get all tickets
router.get("/tickets", ticketsController.getTickets);

module.exports = router;