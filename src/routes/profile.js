const express = require('express');
const User = require("../models/user");
const { userauth } = require("../middlewares/auth");

const profilerouter = express.Router();

profilerouter.get("/profile", userauth, async (req, res) => {
  try {
    const user = req.user; // User is attached by the userauth middleware

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile: " + err.message);
  }

  // console.log("Cookies:", cookies);
  // res.send("reading cookies");
});


module.exports = profilerouter;