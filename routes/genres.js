const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.find({ _id: req.params.id });
  if (!genre) return res.status(404).send("course was not found");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const result = validate(req.body); // dion't need this validation, can use mongoose validation
  //console.log("result", result);
  if (result.error) {
    res.status(400).send(result.error.message);
    return;
  }
  let genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});
router.put("/:id", auth, async (req, res) => {
  const result = await Genre.update(
    // should put this in try catch maybe, it crashes if you don't have the right id
    { _id: req.params.id },
    { $set: { name: req.params.body } }
  );
  // can also use:
  // const genre = await Genre.findByIdAndUpdate(req.params.id{name:req.body.name},{
  // new:true  -- this returns the updated object
  // })
  //genre.name = req.body.name;
  //await genre.save();
  res.send(result);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const result = await Genre.deleteOne({ _id: req.params.id });

  res.send(result);
});

module.exports = router;
