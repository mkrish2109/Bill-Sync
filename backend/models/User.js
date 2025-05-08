// models/User.js (backend)
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'buyer', 'worker'], 
    required: true 
  }, // 'admin' role added
  createdAt: { type: Date, default: Date.now },
  verificationToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordTokenExpiry: {
    type: Date,
  },
},
{
  timestamps: true,
}
);


module.exports = mongoose.model("User", userSchema);
