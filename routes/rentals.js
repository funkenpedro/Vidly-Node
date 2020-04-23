const express = require("express");
const router = express.Router();
const { Movie } = require("../models/movie");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const result = validate(req.body);
  //console.log("result", result);
  if (result.error) {
    res.status(400).send(result.error.message);
    return;
  }
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");
  if (movie.numberInStock === 0)
    return res.status(400).send("movie is not in stock");

  let rental = new Rental({
    customer: { _id: customer._id, name: customer.name, phone: customer.phone },
    movie: {
      _id: movie._id,
      title: movie.title,

      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  rental = await rental.save();
  movie.numberInStock--;
  movie.save();
  res.send(rental);
});

module.exports = router;
