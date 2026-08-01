const express = require("express");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Smart Expense Tracker API is running successfully",
  });
});

app.use("/expenses", expenseRoutes);

module.exports = app;