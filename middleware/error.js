const winston = require("winston");

module.exports = function (err, req, res, next) {
  res.status(500).send("something failed");
  winston.error(err.message, err);
  //winston.log('error', err.message)
  //can log levels, error, warn, info, verbose, debug, silly
  //
  //
  //
};
