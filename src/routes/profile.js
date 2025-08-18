const express = require('express');
const User = require("../models/user");
const { userauth } = require("../middlewares/auth");
const {validateeditprofiledata} = require("../../utils/validation")
const bcrypt = require("bcrypt");


const profilerouter = express.Router();

profilerouter.get("/profile/view", userauth, async (req, res) => {
  try {
    const user = req.user; // User is attached by the userauth middleware

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile: " + err.message);
  }

  // console.log("Cookies:", cookies);
  // res.send("reading cookies");
});

profilerouter.patch("/profile/edit", userauth, async (req, res) => {
  try {
    if(!validateeditprofiledata(req)) {
      throw new Error("Invalid fields in profile edit request");
      return res.status(400).send("Invalid fields in profile edit request");
    }
const loggedInuser = req.user

// console.log(loggedInuser)

Object.keys(req.body).forEach((field) => (loggedInuser[field] = req.body[field]));
// console.log(loggedInuser)
    await loggedInuser.save(); // Save the updated user document to the database

// res.send(`${loggedInuser.firstName} ${loggedInuser.lastName}'s your profile updated successfully`);
res.json({ message: `${loggedInuser.firstName} ${loggedInuser.lastName}'s your profile updated successfully`,data: loggedInuser });

  }catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// profilerouter.patch("/profile/changepassword", userauth, async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     if (!oldPassword || !newPassword) {
//       return res.status(400).send("Old password and new password are required");
//     }
//     const user = req.user; // User is attached by the userauth middleware
//     if (user.password !== oldPassword) {
//       return res.status(400).send("Old password is incorrect");
//     }
//     user.password = newPassword; // Update the password
//     await user.save(); // Save the updated user document to the database
//     res.json({ message: "Password updated successfully" });

//   } catch (err) {
//     res.status(400).send("Error: " + err.message);
//   }
// });

profilerouter.patch("/profile/changepassword", userauth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send("Old password and new password are required");
    }

    const user = req.user; // from userauth middleware

    // Compare old password (plain text vs hashed)
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send("Old password is incorrect");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});


module.exports = profilerouter;