const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

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

// Function to generate an access token
const generateAccessToken = (user) => {
  const payload = {
    ...getTokenUser(user),
    type: "access",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Function to generate a refresh token
const generateRefreshToken = (user) => {
  const payload = {
    userId: user._id,
    type: "refresh",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Function to verify JWT token
const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Function to verify refresh token specifically
const verifyRefreshToken = (token) => {
  const decoded = verifyJWT(token);
  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }
  return decoded;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  getCryptoToken,
  getTokenUser,
  verifyJWT,
  verifyRefreshToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
};
