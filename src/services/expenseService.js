const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/expenses.json");
const normalizedCategory = category.trim().toLowerCase();

function readExpenses() {
  const fileData = fs.readFileSync(dataFilePath, "utf-8");

  return JSON.parse(fileData);
}

function writeExpenses(expenses) {
  fs.writeFileSync(
    dataFilePath,
    JSON.stringify(expenses, null, 2),
    "utf-8"
  );
}

function createExpense(expenseData) {
  const expenses = readExpenses();

  const newExpense = {
    id: expenses.length === 0
      ? 1
      : Math.max(...expenses.map((expense) => expense.id)) + 1,
    ...expenseData,
  };

  expenses.push(newExpense);
  writeExpenses(expenses);

  return newExpense;
}

module.exports = {
  readExpenses,
  writeExpenses,
  createExpense,
  getAllExpenses,
};

function getAllExpenses(category) {
  const expenses = readExpenses();

  if (!category) {
    return expenses;
  }

  const normalizedCategory = category.trim().toLowerCase();

  return expenses.filter(
    (expense) => expense.category.toLowerCase() === normalizedCategory
  );
}