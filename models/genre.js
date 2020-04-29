const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
});
const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = { name: Joi.string().min(5).max(50).required() };
  return Joi.validate(genre, schema);
}
module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validate = validateGenre;
