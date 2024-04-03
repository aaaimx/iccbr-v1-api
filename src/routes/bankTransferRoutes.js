const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const bankTransferController = require("../controllers/bankTransferController");

// Middleware to parse request body as JSON
router.use(bodyParser.json());

// Save registration data
router.post(
  "/create-registration",
  bankTransferController.saveRegistrationData
);

module.exports = router;
