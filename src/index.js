require("dotenv").config();

const express = require("express");
const app = express();
const routes = require("./routes/stripeRoutes");

app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
