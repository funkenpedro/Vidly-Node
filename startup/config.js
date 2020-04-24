const config = require("config");
if (!config.get("jwtPrivateKey")) {
  throw new Error("FATAL ERRROR jwtPrivateKey is not defined");
}
