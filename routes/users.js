const express = require("express");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).send("user was not found");
  res.send(user);
});

router.post("/", async (req, res) => {
  const result = validate(req.body); // dion't need this validation, can use mongoose validation
  //console.log("result", result);
  if (result.error) {
    res.status(400).send(result.error.message);
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const salt = await bcrypt.genSalt(10); //the higher the number the longer it takes and the more comples the string
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  _.pick(user, ["name", "email"]);
  token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});
router.put("/:id", auth, async (req, res) => {
  const result = await User.update(
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

router.delete("/:id", auth, async (req, res) => {
  const result = await User.deleteOne({ _id: req.params.id });

  res.send(result);
});

module.exports = router;
