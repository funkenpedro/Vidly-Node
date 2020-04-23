const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const app = express();
app.use(express.json());
const Joi = require("joi");
const logger = require("./logger");
const auth = require("./authenticate");
const mongoose = require("mongoose");

//const mongoose = require("mongoose");

app.use(logger);
app.use(auth);
app.use(express.static("public"));
app.use("/api/genres", genres); // this is pointing to the routes in genres.js the '/api/genres' can be replaced with /
app.use("/api/customers", customers); //build database here
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log(err.message));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
