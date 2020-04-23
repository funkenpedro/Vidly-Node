const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
//const mongoose = require("mongoose");

const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.find({ _id: req.params.id });
  if (!customer) return res.status(404).send("course was not found");
  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const result = validate(req.body); // dion't need this validation, can use mongoose validation
  //console.log("result", result);
  if (result.error) {
    res.status(400).send(result.error.message);
    return;
  }
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  await customer.save();
  res.send(customer);
});
router.put("/:id", auth, async (req, res) => {
  const result = await Customer.update(
    // should put this in try catch maybe, it crashes if you don't have the right id
    { _id: req.params.id },
    {
      $set: {
        name: req.params.body.name,
        isGold: req.params.body.isGold,
        phone: phone,
      },
    }
  );
  // can also use:
  // const customer = await Customer.findByIdAndUpdate(req.params.id{name:req.body.name},{
  // new:true  -- this returns the updated object
  // })
  //customer.name = req.body.name;
  //await customer.save();
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  const result = await Customer.deleteOne({ _id: req.params.id });

  res.send(result);
});

module.exports = router;
