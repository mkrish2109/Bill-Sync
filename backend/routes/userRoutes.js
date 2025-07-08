const express = require("express");
const userRouter = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  updateAddress
} = require("../controllers/userController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

// Admin routes (require admin privileges)
userRouter.get("/admin/users", authMiddleware, adminMiddleware, getAllUsers);
userRouter.get("/users/:userId", authMiddleware, getUserById);
userRouter.put(
  "/admin/update-role/:userId",
  authMiddleware,
  adminMiddleware,
  [
    check("role", "Role is required").not().isEmpty(),
    check("role", "Invalid role").isIn(['admin', 'buyer', 'worker'])
  ],
  updateUserRole
);
userRouter.delete("/admin/users/:userId", authMiddleware, adminMiddleware, deleteUser);

// User profile routes (authenticated users)
userRouter.get("/user/profile", authMiddleware, getUserProfile);
userRouter.put(
  "/user/profile",
  authMiddleware,
  [
    check("fname", "First name is required").not().isEmpty(),
    check("lname", "Last name is required").not().isEmpty()
    // check("phone", "Phone is required").not().isEmpty()
  ],
  updateUserProfile
);
userRouter.put(
  "/user/profile/address",
  authMiddleware,
  [
    check("country", "Country is required").not().isEmpty(),
    check("state", "State is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("postalCode", "Postal code is required").not().isEmpty(),
    check("addressLine1", "Address line 1 is required").not().isEmpty()
  ],
  updateAddress
);

module.exports = userRouter;