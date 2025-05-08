// routes/admin.js (backend)
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { updateUser, deleteUser, getAllUsers } = require("../controllers/userController");

const router = express.Router();

// Admin can view all users
router.get("/users", [auth.authMiddleware, admin], getAllUsers);

// Admin can update a user's role (e.g., buyer, worker)
router.put("/update-role/:userId", [auth.authMiddleware, admin], updateUser);

// Admin can delete users
router.delete("/delete-user/:userId", [auth, admin], deleteUser);

module.exports = router;
