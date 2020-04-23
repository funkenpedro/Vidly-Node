const mongoose = require("mongoose");
const Joi = require("joi");
const { movieSchema } = require("../models/movie");

const { customerSchema } = require("../models/customer");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String, //new custom schema replaces -customer: { type: customerSchema, required: true },
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      // custom schema replaces movie { type: movieSchema, required: true },
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
      dateOut: {
        type: Date,
        required: true,
        default: Date.now,
      },
      dateReturned: {
        type: Date,
      },
      rentalFee: {
        type: Number,
        min: 0,
      },
    }),
    required: true,
  },
});
/*function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };
  return Joi.validate(movie, schema);
}
*/
const Rental = mongoose.model("Rental", rentalSchema);
function validateRental(rental) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  };

  return Joi.validate(rental, schema);
}
async function createRental(movie, customer) {
  const rental = new Rental({
    movie,
    customer,
  });
  const result = await rental.save();
  console.log(result);
}
module.exports.Rental = Rental;
//exports.validate = validateMovie;
module.exports.rentalSchema = rentalSchema;
exports.validate = validateRental;
