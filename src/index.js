require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/stripeRoutes");

// Enable CORS for all requests
app.use(
  cors({
    origin: "http://localhost:4321",
  })
);

app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
