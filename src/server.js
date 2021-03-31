const cors = require("cors");
const db = require("./db");
const express = require("express");
const session = require("express-session");

// Import our API routes here.
const authRoutes = require("./auth-routes");
const userRoutes = require("./user-routes");

const app = express();
const port = 9000;

// Out special database middleware that adds the `db` field to every request.
app.use(db.database());

// CORS middleware that let's us develop on a different port number using
// create-react-app.
app.use(cors());

// This is JSON body-parser middleware. We need this to "read" incoming JSON
// requests.
app.use(express.json());

// This is session middleware so we can "remember" who is logged-in between
// requests.
app.use(
  session({
    secret: "super secret",
  })
);

// -----------------------------------------------------------------------------
//
// App User API
// ============
//
// These are our user API endpoints. They allow other programs to interact
// with the data that our application manages. For example, our React UI might
// use these endpoints to manage users.
//
// -----------------------------------------------------------------------------

// List all users.
app.get("/api/users", userRoutes.listUsers);

// Create a new user.
app.post("/api/users", userRoutes.createUser);

// Get a user by their ID.
app.get("/api/users/:id", userRoutes.getUser);

// Update a user by their ID.
app.put("/api/users/:id", userRoutes.updateUser);

// Delete a user by their ID.
app.delete("/api/users/:id", userRoutes.deleteUser);

// Sign up a new user!
app.post("/api/sign-up", userRoutes.signUp);

// -----------------------------------------------------------------------------
//
// Auth API
// ========
//
// These API endpoints handle authenticating a user, determining who is
// currently authenticated, and logging-out the logged-in user.
//
// -----------------------------------------------------------------------------

// Get information about the currently logged-in user.
app.get("/api/auth/me", authRoutes.me);

// Log-in a user with a username and password.
app.post("/api/auth/log-in", authRoutes.logIn);

// Log-out the currently logged-in user.
app.post("/api/auth/log-out", authRoutes.logOut);

// -----------------------------------------------------------------------------
//
// Start-Up
// ========
//
// This section connects to the database, then starts the HTTP server.
//
// -----------------------------------------------------------------------------

// First connect to the database.
db.connect()
  // ... then, start the server if we connected successfully.
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  // If we didn't connect to the database, print out the error and stop.
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
