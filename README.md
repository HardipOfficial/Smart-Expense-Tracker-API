# Smart Expense Tracker API

A REST API built with Node.js and Express for managing personal expenses. It supports creating, viewing, filtering, totaling, and deleting expenses. Data is persisted in a local JSON file.

## Features

- Add a new expense
- View all expenses
- Filter expenses by category
- Calculate the overall expense total
- Calculate the total for a specific category
- Delete an expense by ID
- Validate request data
- Persist data in a local JSON file
- Run automated API tests

## Technologies

- Node.js
- Express.js
- Jest
- Supertest
- Local JSON file storage

## Project Structure

```text
Smart-Expense-Tracker-API/
├── README.md
├── AI_NOTES.md
├── package.json
├── package-lock.json
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   │   └── expenseController.js
│   ├── data/
│   │   └── expenses.json
│   ├── routes/
│   │   └── expenseRoutes.js
│   └── services/
│       └── expenseService.js
└── tests/
    └── expense.test.js
```

## Requirements

- Node.js 18 or newer
- npm

The project was developed and tested using Node.js 22.

## Installation

Clone the repository:

```bash
git clone https://github.com/HardipOfficial/Smart-Expense-Tracker-API.git
```

Move into the project directory:

```bash
cd Smart-Expense-Tracker-API
```

Install dependencies:

```bash
npm install
```

## Start the Server

Start the application:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

For development with automatic restarts:

```bash
npm run dev
```

## Run Tests

The server does not need to be running separately when executing tests.

```bash
npm test
```

Expected result:

```text
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

## API Endpoints

### Health Check

```http
GET /
```

Example response:

```json
{
  "message": "Smart Expense Tracker API is running successfully"
}
```

### Add an Expense

```http
POST /expenses
```

Example request:

```json
{
  "title": "Lunch",
  "amount": 250,
  "category": "Food",
  "date": "2026-08-01"
}
```

Example response:

```json
{
  "message": "Expense added successfully",
  "expense": {
    "id": 1,
    "title": "Lunch",
    "amount": 250,
    "category": "Food",
    "date": "2026-08-01"
  }
}
```

### View All Expenses

```http
GET /expenses
```

### Filter Expenses by Category

```http
GET /expenses?category=Food
```

Category matching is case-insensitive, so `Food`, `food`, and `FOOD` return the same category results.

### Calculate Overall Total

```http
GET /expenses/total
```

Example response:

```json
{
  "category": "all",
  "count": 2,
  "total": 330
}
```

### Calculate Total by Category

```http
GET /expenses/total?category=Food
```

### Delete an Expense

```http
DELETE /expenses/1
```

Example response:

```json
{
  "message": "Expense deleted successfully",
  "expense": {
    "id": 1,
    "title": "Lunch",
    "amount": 250,
    "category": "Food",
    "date": "2026-08-01"
  }
}
```

## Validation

The API validates that:

- `title` is present and has at least two characters
- `amount` is a positive number
- `category` is present
- `date` is valid and uses `YYYY-MM-DD`
- Expense IDs are positive integers

## HTTP Status Codes

- `200 OK` — successful retrieval or deletion
- `201 Created` — expense successfully created
- `400 Bad Request` — invalid request data
- `404 Not Found` — expense ID does not exist
- `500 Internal Server Error` — unexpected server error

## Data Storage

Expenses are stored in:

```text
src/data/expenses.json
```

A database is not required for this assignment.

## Automated Testing

The Jest and Supertest suite covers:

- Health-check endpoint
- Creating an expense
- Negative amount rejection
- Viewing all expenses
- Case-insensitive category filtering
- Overall total calculation
- Category total calculation
- Expense deletion
- Missing expense handling
- Invalid expense ID handling

The tests temporarily reset the JSON data and restore its original contents after the suite finishes.