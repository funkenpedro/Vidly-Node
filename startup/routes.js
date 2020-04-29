const express = require("express");
const error = require("../middleware/error");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const logger = require("../logger");
module.exports = function (app) {
  app.use(express.json());
  app.use(logger);
  app.use(auth);
  app.use(express.static("public"));
  app.use("/api/genres", genres); // this is pointing to the routes in genres.js the '/api/genres' can be replaced with / in that file
  app.use("/api/customers", customers); //build database here
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error);
  //**put all the routes from index.js (app.use...)
};
//this function should take app as an argument to be called from index.js
