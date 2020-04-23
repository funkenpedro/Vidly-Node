const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
  const result = validate(req.body); // dion't need this validation, can use mongoose validation
  //console.log("result", result);
  if (result.error) {
    res.status(400).send(result.error.message);
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(user) {
  const schema = {
    password: Joi.string().min(6).required().max(255), //the pasword gets hashed for storage in a bigger 1024 string - see above
    email: Joi.string().min(3).required().email().max(255),
  };
  return Joi.validate(user, schema);
}
module.exports = router;
