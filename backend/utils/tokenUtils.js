const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Function to generate a random crypto token
const getCryptoToken = (randomBytes = 40) => {
  return crypto.randomBytes(randomBytes).toString("hex");
};

// Function to extract user data from a user object
const getTokenUser = (user) => {
  return {
    userId: user._id,
    name: user.fname + " " + user.lname,
    email: user.email,
    role: user.role,
    fname: user.fname,
    lname: user.lname,
  };
};

// Function to generate a JWT token
const getJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// Function to verify JWT token
const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { getJWT, getCryptoToken, getTokenUser, verifyJWT };
