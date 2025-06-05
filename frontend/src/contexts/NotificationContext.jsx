import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../services/notificationService";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();
  const { user, isAuthenticated } = useAuth();
  const role = user?.role;
  const userId = user?._id;

  // Fetch notifications from the server
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n) => !n.read).length);
      }
    } catch (err) {
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await markAsRead(notificationId);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      setError("Failed to mark notification as read");
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await markAllAsRead();
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      setError("Failed to mark all notifications as read");
    }
  };

  // Handle deleting a notification
  const handleDeleteNotification = async (notificationId) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await deleteNotification(notificationId);
      if (response.success) {
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== notificationId)
        );
        setUnreadCount((prev) =>
          notifications.find((n) => n._id === notificationId)?.read
            ? prev
            : Math.max(0, prev - 1)
        );
      }
    } catch (err) {
      setError("Failed to delete notification");
    }
  };

  // Handle clearing all notifications
  const handleClearAllNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await clearAllNotifications();
      if (response.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      setError("Failed to clear notifications");
    }
  };

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  // Set up socket listeners
  useEffect(() => {
    if (!socket || !role || !userId || !isAuthenticated) return;

    // Listen for new request notifications
    socket.on("new_request", (data) => {
      if (role === "worker") {
        const notification = {
          _id: Date.now().toString(),
          type: "request",
          message: data.message || `New request from ${data.senderName}`,
          read: false,
          data: {
            request: data.request,
            sender: data.sender,
            senderName: data.senderName,
          },
          createdAt: new Date(),
        };
        addNotification(notification);
      }
    });

    // Listen for request status updates
    socket.on("request_status_update", (data) => {
      if (role === "buyer") {
        const statusMessage =
          data.status === "accepted"
            ? `Your request was accepted by ${data.workerName}`
            : `Your request was rejected by ${data.workerName}`;

        const notification = {
          _id: Date.now().toString(),
          type: "status_update",
          message: statusMessage,
          read: false,
          data,
          createdAt: new Date(),
        };
        addNotification(notification);
      }
    });

    // Join user's room for notifications
    socket.emit("join_room", userId);

    return () => {
      socket.off("new_request");
      socket.off("request_status_update");
    };
  }, [socket, role, userId, isAuthenticated]);

  // Fetch notifications on mount and when authentication state changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [userId, isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    clearAllNotifications: handleClearAllNotifications,
    refetchNotifications: fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
