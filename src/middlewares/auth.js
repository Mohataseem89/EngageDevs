const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userauth = async (req, res, next) => {
  //to read the token from the req cookies
  try {
    const { token } = req.cookies;
    if (!token) {
    //   return res.status(401).json({ message: "Unauthorized access" });
      // throw new Error("Unauthorized access");
      return res.status(401).send("please login first");

    }
    const decodeobj = await jwt.verify(token, "secretkey");

    const { _id } = decodeobj;
    const user = await User.findById(_id);
    if (!user) {
    //   return res.status(401).json({ message: "Unauthorized access" });
      throw new Error("Unauthorized access");
    }
    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  userauth,
};
