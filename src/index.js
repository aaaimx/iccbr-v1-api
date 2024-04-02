require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const app = express();
const stripe = require("./routes/stripe");

// Enable CORS for all requests
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:4321",
  })
);

// Configurar el middleware de sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Stripe routes
app.use("/api", stripe);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
