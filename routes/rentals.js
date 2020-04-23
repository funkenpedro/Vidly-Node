const express = require("express");
const router = express.Router();
const { Movie } = require("../models/movie");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
Fawn.init(mongoose); // from line 4

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", auth, async (req, res) => {
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
  try {
    new Fawn.Task()
      .save("rentals", rental) // working directly with the collection "rentals" this is ht e first operation
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    //replaces these three lines   rental = await rental.save();
    //                             movie.numberInStock--;
    //                             movie.save();
    res.send(rental);
  } catch {
    res.status(500).send("Something Failed");
  }
});

module.exports = router;
