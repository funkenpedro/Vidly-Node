require("express-async-errors");

const winston = require("winston");
require("winston-mongodb");
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
const error = require("./middleware/error");
const mongoose = require("mongoose");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR:jwtPrivateKey");
  process.exit(1);
}
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost:27017/vidly",
  })
);
winston.add(new winston.transports.Console());
winston.add(
  new winston.transports.File({
    filename: "logfile.log",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  })
);

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);
/*&process.on("uncaughtException", (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});*/

/*process.on("unhandledRejection", (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});

throw new Error("throwing an error");*/
process.on("unhandledRejection", (ex) => {
  throw ex;
});
const p = Promise.reject(new Error("someething failed miserably"));
p.then(() => {
  console.log("aint gonna get here");
});
app.use(logger);
app.use(auth);
app.use(express.static("public"));
app.use("/api/genres", genres); // this is pointing to the routes in genres.js the '/api/genres' can be replaced with / in that file
app.use("/api/customers", customers); //build database here
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log(err.message));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
