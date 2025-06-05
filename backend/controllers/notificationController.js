const Notification = require("../models/Notification");
const {
  sendErrorResponse,
  sendSuccessResponse,
  sendDataResponse,
} = require("../utils/serverUtils");

// Create a new notification
exports.createNotification = async (userId, type, message, data) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!type || !message) {
      throw new Error("Type and message are required");
    }

    const notification = new Notification({
      userId,
      type,
      message,
      data,
    });

    await notification.save();
    return notification;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new Error(`Invalid notification data: ${error.message}`);
    }
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

// Create a notification for a user
exports.createUserNotification = async (req, res) => {
  try {
    const { type, message, data } = req.body;
    const userId = req.user.userId;

    if (!type || !message) {
      return sendErrorResponse(res, "Type and message are required", 400);
    }

    const notification = await this.createNotification(
      userId,
      type,
      message,
      data
    );
    sendDataResponse(res, notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    sendErrorResponse(res, error.message, error.status || 500);
  }
};

// Get user's notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return sendErrorResponse(res, "User ID is required", 400);
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    sendDataResponse(res, notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    sendErrorResponse(res, "Failed to fetch notifications", 500);
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    if (!notificationId) {
      return sendErrorResponse(res, "Notification ID is required", 400);
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return sendErrorResponse(
        res,
        "Notification not found or unauthorized",
        404
      );
    }

    sendDataResponse(res, notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    if (error.name === "CastError") {
      return sendErrorResponse(res, "Invalid notification ID", 400);
    }
    sendErrorResponse(res, "Failed to mark notification as read", 500);
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return sendErrorResponse(res, "User ID is required", 400);
    }

    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    if (result.modifiedCount === 0) {
      return sendSuccessResponse(res, "No unread notifications found");
    }

    sendSuccessResponse(res, "All notifications marked as read");
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    sendErrorResponse(res, "Failed to mark notifications as read", 500);
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    if (!notificationId) {
      return sendErrorResponse(res, "Notification ID is required", 400);
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      return sendErrorResponse(
        res,
        "Notification not found or unauthorized",
        404
      );
    }

    sendSuccessResponse(res, "Notification deleted successfully");
  } catch (error) {
    console.error("Error deleting notification:", error);
    if (error.name === "CastError") {
      return sendErrorResponse(res, "Invalid notification ID", 400);
    }
    sendErrorResponse(res, "Failed to delete notification", 500);
  }
};

// Clear all notifications
exports.clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return sendErrorResponse(res, "User ID is required", 400);
    }

    const result = await Notification.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return sendSuccessResponse(res, "No notifications found to clear");
    }

    sendSuccessResponse(res, "All notifications cleared");
  } catch (error) {
    console.error("Error clearing notifications:", error);
    sendErrorResponse(res, "Failed to clear notifications", 500);
  }
};
