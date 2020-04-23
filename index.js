const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const app = express();
const config = require("config");
app.use(express.json());
const Joi = require("joi");
const logger = require("./logger");

const mongoose = require("mongoose");
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR:jwtPrivateKey");
  process.exit(1);
}
//const mongoose = require("mongoose");

app.use(logger);
app.use(auth);
app.use(express.static("public"));
app.use("/api/genres", genres); // this is pointing to the routes in genres.js the '/api/genres' can be replaced with / in that file
app.use("/api/customers", customers); //build database here
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log(err.message));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
