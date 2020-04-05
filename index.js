const express = require("express");
const app = express();
app.use(express.json());
const Joi = require("joi");

const genres = [
  { id: 1, name: "scary" },
  { id: 2, name: "funny" },
  { id: 3, name: "serious" },
  { id: 4, name: "musical" },
];

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("course was not found");
  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const result = validateGenre(req.body);
  console.log("result", result);
  if (result.error) {
    res.status(400).send(result.error.message);
    return;
  }

  const genre = { id: genres.length + 1, name: req.body.name };
  //have to enable parsing of json objects
  // see top of file app.use
  genres.push(genre);
  res.send(genre);
});
app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("course was not found");
  const result = validateCourse(req.body);

  if (result.error) {
    res.status(400).send(result.error.message);
    return;
  }
  genre.name = req.body.name;
  res.send(genres);
});
app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) res.status(404).send("course was not found");
  index = genres.indexOf(genre);
  genres.splice(parseInt(index, 1));
  res.send(genres);
});

function validateGenre(genre) {
  const schema = { name: Joi.string().min(3).required() };
  return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
