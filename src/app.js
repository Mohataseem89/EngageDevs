const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

// Middleware to parse cookies
app.use(cookieParser());

app.use(express.json());


const authrouter = require("./routes/auth");
const requestrouter = require("./routes/connrequest");  
const profilerouter = require("./routes/profile");



app.use("/", authrouter);
app.use("/", requestrouter);
app.use("/", profilerouter);




//followings are just for testing lateron it will be removed
// get user by email
app.get("/user", async (req, res) => {
  const useremail = req.body.email;
  try {
    const user = await User.findOne({ email: useremail });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }

    //   const users = await User.find({ email: useremail })
    //   if(users.length == 0){
    //     res.status(404).send("User not found");
    //   }else{
    //     res.send(users)

    //   }
  } catch (err) {
    res.status(401).send("Error fetching user: " + err.message);
  }
});

//Feed API - GET /feed - get the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error fetching feed:" + err.message);
  }
});

//delete a user from the database
app.delete("/user", async (req, res) => {
  const userid = req.body.userid;
  try {
    const user = await User.findByIdAndDelete(userid);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error deleting user: " + err.message);
  }
});

//update data of the user
app.patch("/user/:userid", async (req, res) => {
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
//above is just for testing lateron it will be removed

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:");
  });
