const express = require("express");

const requestrouter = express.Router();
const { userauth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectRequest");
const User = require("../models/user");

requestrouter.post(
  "/request/send/:status/:receiverUserId",
  userauth,
  async (req, res) => {
    try {
      const senderUserId = req.user._id;
      const receiverUserId = req.params.receiverUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const receiverUser = await User.findById(receiverUserId);
      if (!receiverUser) {
        return res.status(404).json({ message: "User not found" });
      }

      //to check if there is an existing ConnectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { senderUserId, receiverUserId },
          { senderUserId: receiverUserId, receiverUserId: senderUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "connection Request Already Exists" });
      }

      const connectionRequest = new ConnectionRequest({
        senderUserId,
        receiverUserId,
        status,
      });

      const connectiondata = await connectionRequest.save();

      let actionMessage = "";

      if (status === "interested") {
        actionMessage = `${req.user.firstName} is interested in ${receiverUser.firstName}.`;
      } else if (status === "ignored") {
        actionMessage = `${req.user.firstName} has ignored ${receiverUser.firstName}.`;
      } else {
        actionMessage = `${req.user.firstName} has updated their status for ${receiverUser.firstName}.`;
      }

      res.json({
        message: actionMessage,
        connectiondata,
      });

      // res.json({
      //   message: req.user.firstName + " is " + status + " in "+ receiverUser.firstName,
      //   connectiondata,
      // });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

requestrouter.post(
  "/request/review/:status/:requestId",
  userauth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status } = req.params;
      const requestId = req.params.requestId.trim(); // usinf trim to remove any extra spaced

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        receiverUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: `Connection request ${status} successfully`, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestrouter;
