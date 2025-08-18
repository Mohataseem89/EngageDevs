const express = require("express");
const { validatesignupdata } = require("../../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userauth } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

const authrouter = express.Router();

authrouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validatesignupdata(req);

    const { firstName, lastName, email, password } = req.body;
    //encrypt th password
    const passwordhash = await bcrypt.hash(password, 10);
    // req.body.password = passwordhash;
    console.log("Password hash:", passwordhash);

    //creating new instance of the user model
    // console.log(req.body)
    // res.send("Signup endpoint");
    //creating new instance of the user model
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordhash,
    });
    // const user = new User({
    //   firstName: "Johnny",
    //   lastName: "Doe",
    //   email: "jhon@gmail.com",
    //   password: "password123",
    // });

    await user.save();
    res.send("Signup endpoint");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      // return res.status(404).send("User not found");
      throw new Error("User not found");
    }

    // const ispasswordvalid = await bcrypt.compareSync("Moh@taseem123", "$2b$10$qsi8SGerG4.lQEgeJV.D8u/QuOUM2VxLVC8ydV5g8Uojf6ugk898u");
    const ispasswordvalid = await user.validatepassword(password);
    if (ispasswordvalid) {
      //create A jwt token
      const token = await user.getJWT();

      //add the token to cookie and send the response bacl to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000), // 1 hour
      });

      res.send("Login successful");
    } else {
      // return res.status(401).send("Invalid password");
      throw new Error("Invalid password");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authrouter.post("/logout", async (req, res) => {
  try {
    //clear the cookie
    res.cookie("token", null,{
      expires: new Date(Date.now()), // 1 hour ago
    })
    res.send("Logout successful");  
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authrouter;
