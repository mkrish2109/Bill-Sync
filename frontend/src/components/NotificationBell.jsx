import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNotifications } from "../contexts/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondaryLight hover:text-primary-light dark:text-text-secondaryDark dark:hover:text-primary-dark transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20 rounded-full hover:bg-surface-tertiaryLight dark:hover:bg-surface-tertiaryDark"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FaBell className="w-5 h-5 sm:w-6 sm:h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-bold leading-none text-text-invertedLight transform translate-x-1/2 -translate-y-1/2 bg-error-base rounded-full border-2 border-background-light dark:border-background-dark">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-dropdown shadow-xl dark:shadow-lg dark:shadow-background-dark/50">
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
