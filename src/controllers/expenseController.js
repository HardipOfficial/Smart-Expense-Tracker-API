const expenseService = require("../services/expenseService");

function isValidDate(date) {
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
}

function addExpense(req, res) {
  try {
    const { title, amount, category, date } = req.body;

    if (
      title === undefined ||
      title === null ||
      amount === undefined ||
      amount === null ||
      category === undefined ||
      category === null ||
      date === undefined ||
      date === null
    ) {
      return res.status(400).json({
        message: "Title, amount, category, and date are required",
      });
    }

    if (
      typeof title !== "string" ||
      title.trim().length < 2
    ) {
      return res.status(400).json({
        message: "Title must contain at least 2 characters",
      });
    }

    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be a positive number",
      });
    }

    if (
      typeof category !== "string" ||
      category.trim().length === 0
    ) {
      return res.status(400).json({
        message: "Category must not be empty",
      });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({
        message: "Date must be valid and use YYYY-MM-DD format",
      });
    }

    const newExpense = expenseService.createExpense({
      title: title.trim(),
      amount,
      category: category.trim(),
      date,
    });

    return res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to add expense",
    });
  }
}

function getExpenses(req, res) {
  try {
    const { category } = req.query;

    const expenses = expenseService.getAllExpenses(category);

    return res.status(200).json({
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve expenses",
    });
  }
}

function getExpenseTotal(req, res) {
  try {
    const { category } = req.query;

    const expenses = expenseService.getAllExpenses(category);

    const total = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return res.status(200).json({
      category: category ? category.trim() : "all",
      count: expenses.length,
      total,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to calculate expense total",
    });
  }
}

function deleteExpense(req, res) {
  try {
    const expenseId = Number(req.params.id);

    if (!Number.isInteger(expenseId) || expenseId <= 0) {
      return res.status(400).json({
        message: "Expense ID must be a positive integer",
      });
    }

    const deletedExpense =
      expenseService.deleteExpenseById(expenseId);

    if (!deletedExpense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      message: "Expense deleted successfully",
      expense: deletedExpense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete expense",
    });
  }
}

module.exports = {
  addExpense,
  getExpenses,
  getExpenseTotal,
  deleteExpense,
};