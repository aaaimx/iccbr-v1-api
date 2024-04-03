require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const stripeRoutes = require("./routes/stripeRoutes");
const ticketsRoutes = require("./routes/ticketsRoutes");

// Enable CORS for all requests
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:4321",
  })
);

// Routes
app.use("/api", stripeRoutes);
app.use("/api", ticketsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
