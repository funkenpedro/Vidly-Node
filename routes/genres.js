const express = require("express");
const router = express.Router();

const Joi = require("joi");

const genres = [
  { id: 1, name: "scary" },
  { id: 2, name: "funny" },
  { id: 3, name: "serious" },
  { id: 4, name: "musical" },
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("course was not found");
  res.send(genre);
});

router.post("/", (req, res) => {
  const result = validateGenre(req.body);
  console.log("result", result);
  if (result.error) {
    res.status(400).send(result.error.message);
    return;
  }

  const genre = { id: genres.length + 1, name: req.body.name };
  //have to enable parsing of json objects
  // see top of file router.use
  genres.push(genre);
  res.send(genre);
});
router.put("/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("course was not found");
  const result = validateGenre(req.body);

  if (result.error) {
    res.status(400).send(result.error.message);
    return;
  }
  genre.name = req.body.name;
  res.send(genres);
});
router.delete("/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("course was not found");
  index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

function validateGenre(genre) {
  const schema = { name: Joi.string().min(3).required() };
  return Joi.validate(genre, schema);
}

module.exports = router;
