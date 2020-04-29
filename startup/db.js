const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
module.exports = function () {
  +mongoose
    .connect(config.get("db"))
    .then(() => console.log(`connected to ${config.get("db")}`))
    .then(() => winston.info(`connected to ${config.get("db")}`))
    .catch((err) => console.log(err.message));
  // .connect("mongodb://localhost/vidly")
  // .then(() => winston.info("connected to mongodb"));
  //.catch((err) => console.log(err.message));  the error handling will now deal with this
};
