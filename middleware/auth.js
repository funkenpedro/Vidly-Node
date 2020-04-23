const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("access denied, no token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded; // this is the decoded payload,the one that gets encoded in user.generateAuthToken with a payload of user.id
    next(); //next passes control to the next middleware function
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
