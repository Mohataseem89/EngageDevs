const express = require("express");
const userrouter = express.Router();
const { userauth } = require("../middlewares/auth");

const connectionRequest = require("../models/connectRequest");
const User = require("../models/user");
const User_Data = "firstName lastName photoUrl skills age gender";

//to get the pending connection request for the loggedin user
userrouter.get("/user/requests/recieved", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequest
      .find({
        receiverUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("senderUserId", User_Data);
    res.json({
      message: "Connection requests fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

userrouter.get("/user/connections", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    


    const connections = await connectionRequest
      .find({
        $or: [
          { senderUserId: loggedInUser._id, status: "accepted" },
          { receiverUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("senderUserId", User_Data)
      .populate("receiverUserId", User_Data);
    // }).populate("senderUserId", User_Data)

    // console.log(connections)
    const data = connections.map((row) => {
      if (row.senderUserId._id.equals(loggedInUser._id)) {
        return row.recieverUserId;
      }
      return row.senderUserId;
    });

    res.json({
      message: "Connections fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//feed API
userrouter.get("/feed", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // 
    const skip = (page - 1) * limit;

    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { senderUserId: loggedInUser._id },
          { receiverUserId: loggedInUser._id },
        ],
      })
      .select("senderUserId receiverUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.senderUserId.toString());
      hideUsersFromFeed.add(req.receiverUserId.toString());
    });
    // console.log(hideUsersFromFeed);

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(User_Data).skip(skip).limit(limit);

    // res.send(connectionRequests);
    res.send(users)
  } catch (err) {
    res.status(400).send("Error fetching feed:" + err.message);
  }
});






//just for practice
//update data of the user
userrouter.patch("/user/:userid", async (req, res) => {
  const userid = req.params?.userid;
  // app.patch("/user", async (req, res) => {
  //   const userid = req.body.userid;
  const data = req.body;

  try {
    const allowed_updates = [
      "firstName",
      "lastName",
      "skills",
      "email",
      "password",
    ];

    const isupdateallowed = Object.keys(data).every((k) =>
      allowed_updates.includes(k)
    );

    if (!isupdateallowed) {
      throw new Error("Invalid updates");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot exceed 10 items");
    }
    await User.findByIdAndUpdate({ _id: userid }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Error updating user: " + err.message);
  }
});

//for practice

module.exports = userrouter;
