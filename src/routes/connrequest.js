const express = require('express');

const requestrouter = express.Router();
const { userauth } = require("../middlewares/auth");

requestrouter.post("/sendconnectreq", userauth, async(req, res)=>{
  //to send connection request to the user
  const user = req.user; // User is attached by the userauth middleware
  console.log("sending connection request");

  res.send( user.firstName + " Connection request sent");
})



module.exports = requestrouter;