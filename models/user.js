const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, mlength: 1024 },
  name: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required(),
    password: Joi.string().min(6).required().max(255), //the pasword gets hashed for storage in a bigger 1024 string - see above
    email: Joi.string().min(3).required().email().max(255),
  };
  return Joi.validate(user, schema);
}
module.exports.User = User;

module.exports.validate = validateUser;
