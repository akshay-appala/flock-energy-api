require("dotenv").config();

const express = require("express");
const app = express();

// Import meter routes
const meterRoutes = require("./src/routes/meters");

// Middleware to read JSON request bodies
app.use(express.json());

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "Flock Energy API is running",
  });
});

// Meter routes
app.use("/api/meters", meterRoutes);

module.exports = app;
