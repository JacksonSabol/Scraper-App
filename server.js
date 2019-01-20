// Importing dependencies
var express = require("express");
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require("morgan");
var mongoose = require("mongoose");

// If deployed, use the deployed database. Otherwise use the local newsScraperDB database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraperDB";

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();
// Allow for PORT to be set by an environmental variable upon deployment
var PORT = process.env.PORT || 3000;

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow Express to serve static directories (like HTML, JavaScript, and Stylesheets)
app.use(express.static("public"));

// Set up app to use handlebars with a default layout of "main"
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes
var routes = require('./routes/api-routes.js');
app.use(routes);

// Connect to the Mongo DB using flags to avoid deprecated methods
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});