# AI Usage Notes

## Development Log

### Step 1: Project setup and Express server

#### AI-generated or AI-assisted

- AI recommended Node.js and Express because I already had experience with the MERN stack.
- AI suggested separating the Express application into `app.js` and the server startup code into `server.js`.
- AI provided the initial project structure, dependency list, and health-check endpoint example.

#### Completed and understood by me

- I manually created the project folders and files.
- I installed Express, Jest, Supertest, and Nodemon using npm.
- I configured the npm scripts in `package.json`.
- I added the Express JSON middleware and health-check endpoint.
- I learned that `app.js` exports the Express application while `server.js` starts it on a port.

#### Validation performed by me

- I used `npm list --depth=0` to confirm that all required packages were installed.
- I started the server using `npm start`.
- I opened the root endpoint in the browser and verified the JSON response.
- I checked that npm reported zero known vulnerabilities during installation.

### Step 2: Add expense endpoint

#### AI-generated or AI-assisted

- AI suggested separating file-storage logic into a service and HTTP request handling into a controller.
- AI provided an initial implementation for reading and writing expenses using Node.js `fs`.
- AI suggested generating a new ID using the highest existing ID plus one.

#### Written or changed by me

- I manually added minimum-title-length validation.
- I retained strict numeric validation so that string values such as `"250"` are not silently accepted.
- I used a JSON file instead of in-memory storage so expenses remain available after restarting the server.

#### Validation performed by me

- I sent a valid POST request and verified the `201 Created` response.
- I checked that the new expense was written to `src/data/expenses.json`.
- I sent an invalid request with a negative amount and verified that the API returned a `400` response.
- I reviewed the ID-generation logic and confirmed that it avoids duplicate IDs after an expense is deleted.

### Step 3: View and filter expenses

#### AI-generated or AI-assisted

- AI suggested using a query parameter for category filtering.
- AI suggested keeping filtering logic inside the service layer.
- AI provided the initial GET endpoint structure.

#### Written or changed by me

- I manually normalized the category query using `trim()` and `toLowerCase()`.
- I kept category matching case-insensitive to make the API easier to use.
- I added a `count` field to the response so clients can quickly see how many expenses matched.

#### Validation performed by me

- I retrieved all expenses using `GET /expenses`.
- I tested filtering with `GET /expenses?category=Food`.
- I tested lowercase filtering with `category=food`.
- I verified that an unknown category returned an empty array instead of an error.
- While implementing category filtering, I accidentally placed the category-normalization statement outside the service function. This caused a `ReferenceError` and prevented the server from starting.
- I used the stack trace to locate the faulty line, moved it inside `getAllExpenses`, restarted the server, and retested the endpoint.
- My first totals implementation returned the total but omitted the matching expense count. The automated tests caught this because `response.body.count` was undefined.
- I updated the controller to retrieve the filtered expenses once, then used the same array for both `count` and `total`. This also avoided reading the JSON file twice.