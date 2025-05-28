import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { FaCheck, FaTrash, FaCheckDouble } from 'react-icons/fa';
import LoadingSpinner from './common/LoadingSpinner';

const NotificationDropdown = ({ onClose }) => {
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications();

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleDelete = async (notificationId) => {
    await deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
  };

  if (loading) {
    return (
      <div className="w-80 sm:w-96 bg-surface-elevatedLight dark:bg-surface-elevatedDark rounded-lg shadow-card dark:shadow-card-dark overflow-hidden border border-border-light dark:border-border-dark">
        <div className="p-4 flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 sm:w-96 bg-surface-elevatedLight dark:bg-surface-elevatedDark rounded-lg shadow-card dark:shadow-card-dark overflow-hidden border border-border-light dark:border-border-dark">
        <div className="p-4 text-error-base bg-error-base/10 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 sm:w-96 bg-surface-elevatedLight dark:bg-surface-elevatedDark rounded-lg shadow-card dark:shadow-card-dark overflow-hidden border border-border-light dark:border-border-dark">
      <div className="p-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Notifications</h3>
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="p-2 text-text-secondaryLight hover:text-primary-light dark:text-text-secondaryDark dark:hover:text-primary-dark transition-colors duration-150 rounded-lg hover:bg-surface-tertiaryLight dark:hover:bg-surface-tertiaryDark focus:outline-none focus:ring-2 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20"
              title="Mark all as read"
              aria-label="Mark all notifications as read"
            >
              <FaCheckDouble className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearAll}
              className="p-2 text-text-secondaryLight hover:text-error-base dark:text-text-secondaryDark dark:hover:text-error-base transition-colors duration-150 rounded-lg hover:bg-surface-tertiaryLight dark:hover:bg-surface-tertiaryDark focus:outline-none focus:ring-2 focus:ring-error-base/20"
              title="Clear all"
              aria-label="Clear all notifications"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-text-secondaryLight dark:text-text-secondaryDark">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 border-b border-border-subtleLight dark:border-border-subtleDark hover:bg-surface-tertiaryLight dark:hover:bg-surface-tertiaryDark transition-colors duration-150 ${
                !notification.read ? 'bg-highlight-light dark:bg-highlight-dark/50' : ''
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-light dark:text-text-dark break-words">
                    {notification.message}
                  </p>
                  <p className="text-xs text-text-tertiaryLight dark:text-text-tertiaryDark mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true
                    })}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="p-2 text-text-secondaryLight hover:text-primary-light dark:text-text-secondaryDark dark:hover:text-primary-dark transition-colors duration-150 rounded-lg hover:bg-surface-tertiaryLight dark:hover:bg-surface-tertiaryDark focus:outline-none focus:ring-2 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20"
                      title="Mark as read"
                      aria-label={`Mark notification as read`}
                    >
                      <FaCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="p-2 text-text-secondaryLight hover:text-error-base dark:text-text-secondaryDark dark:hover:text-error-base transition-colors duration-150 rounded-lg hover:bg-surface-tertiaryLight dark:hover:bg-surface-tertiaryDark focus:outline-none focus:ring-2 focus:ring-error-base/20"
                    title="Delete"
                    aria-label={`Delete notification`}
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;