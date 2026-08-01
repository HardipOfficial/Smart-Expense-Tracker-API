const express = require("express");

const app = express();

// Allows the API to accept JSON data from request bodies
app.use(express.json());

// Health-check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Smart Expense Tracker API is running successfully",
  });
});

module.exports = app;