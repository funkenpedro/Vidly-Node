const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.find({ _id: req.params.id });
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
  await user.save();
  res.send(user);
});
router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  const result = await User.deleteOne({ _id: req.params.id });

  res.send(result);
});

module.exports = router;
