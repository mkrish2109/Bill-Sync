const express = require("express");
const { getAllUsers, deleteUser, updateUser } = require("../controllers/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const userRouter = express.Router();


// Admin can view all users
userRouter.get("/users", authMiddleware, adminMiddleware, getAllUsers);

userRouter.put("/update-role/:userId", authMiddleware, adminMiddleware, updateUser);

// Admin can delete users
userRouter.delete("/delete-user/:userId", authMiddleware, adminMiddleware, deleteUser);

module.exports = userRouter;
