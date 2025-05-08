const User = require("../models/User");

export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

export const getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

export const updateUser = async (req, res) => {
    const { role } = req.body;
    
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Ensure only valid roles are assigned
      if (!['admin', 'buyer', 'worker'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      user.role = role;
      await user.save();
      res.json({ message: "User role updated" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

export const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
 }