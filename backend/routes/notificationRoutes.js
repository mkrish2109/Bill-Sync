const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = require("../controllers/notificationController");

// Get all notifications for the current user
router.get("/", authMiddleware, getUserNotifications);

// Mark all notifications as read (must come before :notificationId routes)
router.patch("/read-all", authMiddleware, markAllAsRead);

// Clear all notifications (must come before :notificationId routes)
router.delete("/clear-all", authMiddleware, clearAllNotifications);

// Mark a specific notification as read
router.patch("/:notificationId/read", authMiddleware, markAsRead);

// Delete a specific notification
router.delete("/:notificationId", authMiddleware, deleteNotification);

module.exports = router;
