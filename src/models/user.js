const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email format");
      }
    },
    
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("enter strong password:" + value);
      }
    },
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("Invalid gender value");
      }
    },
  },
  photoUrl: {
    type: String,
    default:
      "https://uhs-group.com/wp-content/uploads/2020/08/person-dummy-e1553259379744.jpg",
      validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid photo URL format");
      }
    },
  },
  about: {
    type: String,
    default: "No description provided",
  },
  skills: {
    type: [String],
  },
},{timestamps: true});

// const User = mongoose.model("User", userSchema);
// module.exports = User;

module.exports = mongoose.model("User", userSchema);
