const request = require("supertest");
const fs = require("fs");
const path = require("path");

const app = require("../src/app");

const dataFilePath = path.join(
  __dirname,
  "../src/data/expenses.json"
);

let originalData;

beforeAll(() => {
  originalData = fs.readFileSync(dataFilePath, "utf-8");
});

beforeEach(() => {
  fs.writeFileSync(dataFilePath, "[]", "utf-8");
});

afterAll(() => {
  fs.writeFileSync(dataFilePath, originalData, "utf-8");
});

describe("Smart Expense Tracker API", () => {
  test("GET / should return API health message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      "Smart Expense Tracker API is running successfully"
    );
  });

  test("POST /expenses should create a new expense", async () => {
    const newExpense = {
      title: "Lunch",
      amount: 250,
      category: "Food",
      date: "2026-08-01",
    };

    const response = await request(app)
      .post("/expenses")
      .send(newExpense);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe(
      "Expense added successfully"
    );
    expect(response.body.expense).toMatchObject(newExpense);
    expect(response.body.expense.id).toBe(1);
  });

  test("POST /expenses should reject missing required fields", async () => {
    const response = await request(app)
      .post("/expenses")
      .send({
        title: "Lunch",
        amount: 250,
        date: "2026-08-01",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Title, amount, category, and date are required"
    );
  });

  test("POST /expenses should reject a blank title", async () => {
    const response = await request(app)
      .post("/expenses")
      .send({
        title: " ",
        amount: 100,
        category: "Food",
        date: "2026-08-01",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Title must contain at least 2 characters"
    );
  });

  test("POST /expenses should reject a negative amount", async () => {
    const response = await request(app)
      .post("/expenses")
      .send({
        title: "Coffee",
        amount: -50,
        category: "Food",
        date: "2026-08-01",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Amount must be a positive number"
    );
  });

  test("POST /expenses should reject a string amount", async () => {
    const response = await request(app)
      .post("/expenses")
      .send({
        title: "Coffee",
        amount: "50",
        category: "Food",
        date: "2026-08-01",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Amount must be a positive number"
    );
  });

  test("POST /expenses should reject a blank category", async () => {
    const response = await request(app)
      .post("/expenses")
      .send({
        title: "Lunch",
        amount: 100,
        category: " ",
        date: "2026-08-01",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Category must not be empty"
    );
  });

  test("POST /expenses should reject an invalid calendar date", async () => {
    const response = await request(app)
      .post("/expenses")
      .send({
        title: "Lunch",
        amount: 100,
        category: "Food",
        date: "2026-02-31",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Date must be valid and use YYYY-MM-DD format"
    );
  });

  test("GET /expenses should return all expenses", async () => {
    await request(app).post("/expenses").send({
      title: "Lunch",
      amount: 250,
      category: "Food",
      date: "2026-08-01",
    });

    await request(app).post("/expenses").send({
      title: "Bus ticket",
      amount: 80,
      category: "Travel",
      date: "2026-08-01",
    });

    const response = await request(app).get("/expenses");

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(2);
    expect(response.body.expenses).toHaveLength(2);
  });

  test("GET /expenses should filter by category", async () => {
    await request(app).post("/expenses").send({
      title: "Lunch",
      amount: 250,
      category: "Food",
      date: "2026-08-01",
    });

    await request(app).post("/expenses").send({
      title: "Bus ticket",
      amount: 80,
      category: "Travel",
      date: "2026-08-01",
    });

    const response = await request(app)
      .get("/expenses")
      .query({ category: "food" });

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.expenses[0].category).toBe("Food");
  });

  test("GET /expenses/total should calculate overall total", async () => {
    await request(app).post("/expenses").send({
      title: "Lunch",
      amount: 250,
      category: "Food",
      date: "2026-08-01",
    });

    await request(app).post("/expenses").send({
      title: "Bus ticket",
      amount: 80,
      category: "Travel",
      date: "2026-08-01",
    });

    const response = await request(app).get("/expenses/total");

    expect(response.statusCode).toBe(200);
    expect(response.body.category).toBe("all");
    expect(response.body.count).toBe(2);
    expect(response.body.total).toBe(330);
  });

  test("GET /expenses/total should calculate category total", async () => {
    await request(app).post("/expenses").send({
      title: "Lunch",
      amount: 250,
      category: "Food",
      date: "2026-08-01",
    });

    await request(app).post("/expenses").send({
      title: "Coffee",
      amount: 50,
      category: "Food",
      date: "2026-08-01",
    });

    const response = await request(app)
      .get("/expenses/total")
      .query({ category: "food" });

    expect(response.statusCode).toBe(200);
    expect(response.body.category).toBe("food");
    expect(response.body.count).toBe(2);
    expect(response.body.total).toBe(300);
  });

  test("DELETE /expenses/:id should delete an expense", async () => {
    const createResponse = await request(app)
      .post("/expenses")
      .send({
        title: "Lunch",
        amount: 250,
        category: "Food",
        date: "2026-08-01",
      });

    const expenseId = createResponse.body.expense.id;

    const deleteResponse = await request(app).delete(
      `/expenses/${expenseId}`
    );

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.message).toBe(
      "Expense deleted successfully"
    );

    const listResponse = await request(app).get("/expenses");

    expect(listResponse.body.count).toBe(0);
  });

  test("DELETE /expenses/:id should return 404 for missing expense", async () => {
    const response = await request(app).delete("/expenses/999");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Expense not found");
  });

  test("DELETE /expenses/:id should reject an invalid ID", async () => {
    const response = await request(app).delete("/expenses/abc");

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Expense ID must be a positive integer"
    );
  });
});