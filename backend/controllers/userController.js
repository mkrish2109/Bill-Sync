const User = require("../models/User");
const Address = require("../models/Address");
const { validationResult } = require("express-validator");
const { sendSuccessResponse } = require("../utils/serverUtils");
const Worker = require("../models/Worker");
const Buyer = require("../models/Buyer");

// Admin Functions
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let additionalData = null;
    if (user.role === 'worker') {
      additionalData = await Worker.findOne({ userId: req.params.userId });
    } else if (user.role === 'buyer') {
      additionalData = await Buyer.findOne({ userId: req.params.userId }).populate('assignedFabrics');
    }

    res.json({ ...user.toObject(), additionalData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


const updateUserRole = async (req, res) => {
  const { role } = req.body;
  
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!['admin', 'buyer', 'worker'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // If changing from worker/buyer to another role, remove the specific profile
    if (user.role === 'worker' && role !== 'worker') {
      await Worker.findOneAndDelete({ userId: req.params.userId });
    } else if (user.role === 'buyer' && role !== 'buyer') {
      await Buyer.findOneAndDelete({ userId: req.params.userId });
    }

    user.role = role;
    await user.save();
    
    res.json({ 
      message: "User role updated", 
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete associated data based on role
    if (user.role === 'worker') {
      await Worker.findOneAndDelete({ userId: req.params.userId });
    } else if (user.role === 'buyer') {
      await Buyer.findOneAndDelete({ userId: req.params.userId });
    }
    
    // Also delete associated addresses
    await Address.deleteMany({ userId: req.params.userId });
    
    res.json({ message: "User deleted successfully" });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// User Profile Functions
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const address = await Address.findOne({ userId: req.user.userId, isDefault: true });
    
    let additionalData = null;
    if (user.role === 'worker') {
      additionalData = await Worker.findOne({ userId: req.user.userId });
    } else if (user.role === 'buyer') {
      additionalData = await Buyer.findOne({ userId: req.user.userId }).populate('assignedFabrics');
    }
    
    res.json({ user, address, additionalData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  // console.log(req.body);
  // console.log(req.user.userId); 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fname, lname, phone, bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fname, lname, phone, bio },
      { new: true }
    );
    // console.log("user data",user);
 
    res.status(200).json({ success: true, message:"Data updated successfully", data: user });
    // res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { country, state, city, postalCode, addressLine1, addressLine2 } = req.body;
    
    let address = await Address.findOne({ userId: req.user.userId, isDefault: true });
    
    if (address) {
      address = await Address.findByIdAndUpdate(
        address._id,
        { country, state, city, postalCode, addressLine1, addressLine2 },
        { new: true }
      );
    } else {
      address = new Address({
        userId: req.user.userId,
        country,
        state,
        city,
        postalCode,
        addressLine1,
        addressLine2,
        isDefault: true
      });
      await address.save();
    }
    
    res.status(200).json({ success: true, message:"Data updated successfully", data: address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  // Admin functions
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  
  // User profile functions
  getUserProfile,
  updateUserProfile,
  updateAddress
};