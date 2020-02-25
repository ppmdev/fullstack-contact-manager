// Import syntax isn't used here because its not using babel to convert to ES6 syntax. CommonJS syntax is used instead.
const express = require("express");

// Import the Database connection module
const connectDB = require("./config/db");

const path = require("path");

// Initialize express server assigned to the variable app.
const app = express();

// Connect the database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

// Add a route (endpoint) that the API. This is done using a method like the following app.[type of request]().
// The get method takes in the path and then a request response object.

app.get("/api", (req, res) =>
  res.json({ msg: "Welcome the the Contact Manager API" })
);

// Define the routes for the app using app.use(), this takes the path and requires the file to be used for the routes.

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

/** Serve static assets in production */
// This checks if the application is in a production environment and if it is, it will respond with the index.html
// file from the client/build folder when any ('*') route is hit.
if (process.env.NODE_ENV === "production") {
  // Set a static folder
  app.use(express.static("client/build"));
  // When any route is hit respond with the index.html file in the build folder, resolved using nodes path.resolve method
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

/* The app object will have a listen method that will take a port to listen on. This port can also be set to a variable
   and the value can be dynamic depending on if it's a development environment or production environment */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
