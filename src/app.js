const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validatesignupdata } = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userauth } = require("./middlewares/auth");

// Middleware to parse cookies
app.use(cookieParser());

app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userauth, async (req, res) => {
  try {
    const user = req.user; // User is attached by the userauth middleware

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile: " + err.message);
  }

  // console.log("Cookies:", cookies);
  // res.send("reading cookies");
});



app.post("/sendconnectreq", userauth, async(req, res)=>{
  //to send connection request to the user
  const user = req.user; // User is attached by the userauth middleware
  console.log("sending connection request");

  res.send( user.firstName + " Connection request sent");
})











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
