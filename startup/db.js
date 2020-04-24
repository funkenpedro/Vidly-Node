const mongoose = require("mongoose");
const winston = require("winston");
module.exports = function () {
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => winston.info("connected to mongodb"));
  //.catch((err) => console.log(err.message));  the error handling will now deal with this
};
