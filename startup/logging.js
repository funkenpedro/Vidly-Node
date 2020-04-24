require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost:27017/vidly",
    })
  );
  //winston.add(new winston.transports.Console());
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );

  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );
  /*&process.on("uncaughtException", (ex) => {         uncomment these to not use winston handleExceptions in place
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
  /*const p = Promise.reject(new Error("someething failed miserably")); //uncomment this to see it throw an error
  p.then(() => {
    console.log("aint gonna get here");
  });
*/
};
