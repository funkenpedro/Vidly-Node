const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  id: Number,
  name: String,
});
const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = { name: Joi.string().min(3).required() };
  return Joi.validate(genre, schema);
}
module.exports.Genre = Genre;
module.exports.validate = validateGenre;
