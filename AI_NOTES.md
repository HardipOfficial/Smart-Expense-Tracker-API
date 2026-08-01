# AI Usage Notes

I used ChatGPT as a development assistant while building this assignment. It helped me plan the project structure, draft initial implementations, understand unfamiliar parts, review errors, and prepare tests and documentation.

I did not rely on the generated code without validation. I integrated the suggested code into the project, ran it locally, manually tested the endpoints, fixed issues, and used automated tests to verify the final behaviour.

## 1. Which parts were AI-generated vs. written or changed by me

### AI-generated or AI-assisted

AI provided or helped draft:

- The initial Express project structure
- The separation of `app.js` and `server.js`
- The Route → Controller → Service architecture
- Initial code drafts for the expense routes, controller, and service
- JSON-file reading and writing using Node.js `fs`
- Input-validation suggestions
- The initial Jest and Supertest test-suite structure
- README and AI_NOTES organization
- Debugging suggestions based on error messages and test failures

### Completed, configured, or changed by me

I personally:

- Created the project folders and files
- Initialized the npm project and installed the dependencies
- Configured the npm scripts
- Chose Node.js and Express based on my previous MERN-stack experience
- Connected the routes, controllers, services, and JSON storage
- Added minimum title-length validation
- Added case-insensitive category normalization using `trim()` and `toLowerCase()`
- Added the matching-expense `count` to list and total responses
- Refactored the totals controller to reuse one filtered expense array
- Ran all manual API requests and automated tests
- Diagnosed and fixed runtime and test failures
- Managed the Git commits and pushed the completed work to GitHub

## 2. What I validated, tested, or changed in the AI output, and why

### Input validation

I verified that the API rejects:

- Missing required fields
- Titles shorter than two characters
- Zero or negative amounts
- Amounts that are not JSON numbers
- Invalid dates or dates not using `YYYY-MM-DD`
- Invalid or non-positive expense IDs

Strict validation prevents invalid expense records from being stored.

### Category filtering

I normalized category values using `trim()` and `toLowerCase()`.

This makes category matching case-insensitive, so values such as `Food`, `food`, and `FOOD` return the same matching expenses.

### Expense ID generation

The new ID is calculated using the highest existing ID plus one instead of using the array length.

This prevents duplicate IDs when an expense has previously been deleted.

### Manual API testing

I manually tested:

- Creating a valid expense
- Rejecting a negative amount
- Viewing all expenses
- Filtering by category
- Filtering using different letter cases
- Calculating the overall total
- Calculating a category-specific total
- Deleting an existing expense
- Deleting a missing expense
- Rejecting an invalid expense ID

I also checked that expenses were written to the local JSON file.

### Debugging and changes

While implementing category filtering, I accidentally placed the category-normalization statement outside the service function. This caused a `ReferenceError` and prevented the server from starting. I used the stack trace to identify the faulty line, moved it inside `getAllExpenses`, restarted the server, and tested the endpoint again.

The delete endpoint initially returned `Cannot DELETE /expenses/2`. I determined that the running Node process had not reloaded the newly added route. After restarting the server, I verified that deletion worked correctly.

My first totals response returned the total but did not include the matching expense count. The automated test reported that `response.body.count` was `undefined`. I updated the controller to retrieve the filtered expenses once and use the same array for both `count` and `total`. This also avoided an unnecessary second file read.

The final Jest and Supertest suite contains 10 tests, and all 10 tests pass.

## 3. AI suggestions I decided not to use, and why

- AI initially suggested FastAPI because it provides automatic Swagger documentation. I selected Node.js and Express instead because it matches my existing MERN-stack experience and I can understand and explain the implementation more confidently.
- AI suggested considering Swagger/OpenAPI as an optional bonus if enough time remained. I decided not to add it because the bonus was not required, and I prioritized completing all required endpoints, validation, automated tests, documentation, and final verification before the deadline.

## Final result

AI accelerated the initial implementation and review process, but I manually ran, tested, debugged, and validated the final application before submission.