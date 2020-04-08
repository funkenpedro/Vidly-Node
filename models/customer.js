const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: String,
  phone: String,
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(7).max(7).required(),
    isGold: Joi.boolean(),
  };
  return Joi.validate(customer, schema);
}

module.exports.validate = validateCustomer;
module.exports.Customer = Customer;
