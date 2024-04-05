require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env",
});

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const stripeRoutes = require("./routes/stripeRoutes");
const ticketsRoutes = require("./routes/ticketsRoutes");
const bankTransferRoutes = require("./routes/bankTransferRoutes");

// Enable CORS for all requests
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:4321",
  })
);

// Routes
app.use("/api", stripeRoutes);
app.use("/api", ticketsRoutes);
app.use("/api", bankTransferRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
