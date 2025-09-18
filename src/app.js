const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// CORS Configuration - Use ONLY this approach
const corsOptions = {
  origin: 'http://localhost:5173', // Your exact frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false // Let cors middleware handle preflight
};

// Apply CORS BEFORE other middleware - this is critical
app.use(cors(corsOptions));

// Other middleware AFTER CORS
app.use(cookieParser());
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
  next();
});

// Import routes
const authrouter = require("./routes/auth");
const requestrouter = require("./routes/connrequest");
const profilerouter = require("./routes/profile");
const userrouter = require("./routes/user");

// Apply routes
app.use("/", authrouter);
app.use("/", requestrouter);
app.use("/", profilerouter);
app.use("/", userrouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
connectDB()
  .then(() => {
    console.log(" MongoDB connected successfully");
    app.listen(3000, () => {
      console.log(" Server is running on http://localhost:3000");
      console.log(" CORS configured for http://localhost:5173");
      console.log("Credentials enabled for cross-origin requests");
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err);
    process.exit(1);
  });
