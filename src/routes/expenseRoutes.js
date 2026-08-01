const express = require("express");
const expenseController = require("../controllers/expenseController");

const router = express.Router();

router.get("/total", expenseController.getExpenseTotal);
router.post("/", expenseController.addExpense);
router.get("/", expenseController.getExpenses);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;