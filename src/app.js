const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors")
// Middleware to parse cookies
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true // allow credentials (cookies) to be sent
}))
app.use(cookieParser());

app.use(express.json());

const authrouter = require("./routes/auth");
const requestrouter = require("./routes/connrequest");
const profilerouter = require("./routes/profile");
const userrouter = require("./routes/user");

app.use("/", authrouter);
app.use("/", requestrouter);
app.use("/", profilerouter);
app.use("/", userrouter);

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
