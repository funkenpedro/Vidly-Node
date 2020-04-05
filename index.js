const express = require("express");
const genres = require("./routes/genres");
const app = express();
app.use(express.json());
const Joi = require("joi");
const logger = require("./logger");
const auth = require("./authenticate");
app.use(logger);
app.use(auth);
app.use(express.static("public"));
app.use("/api/genres", genres); // this is pointing to the routes in genres.js the '/api/genres' can be replaced with /

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
