const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Remove any existing CORS configuration and replace with this:
app.use((req, res, next) => {
  // Set CORS headers manually for maximum control
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request received for:', req.url, 'Method:', req.headers['access-control-request-method']);
    return res.status(200).end();
  }
  
  console.log(`${req.method} request to ${req.url}`);
  next();
});

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
