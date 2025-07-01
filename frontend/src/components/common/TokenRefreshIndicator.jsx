import React, { useState } from "react";
import { useTokenRefresh } from "../../hooks/useTokenRefresh";
import { FaSync } from "react-icons/fa";

const TokenRefreshIndicator = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshToken } = useTokenRefresh();

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshToken();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleManualRefresh}
      disabled={isRefreshing}
      className="p-2 text-text-secondaryLight hover:text-primary-light dark:text-text-secondaryDark dark:hover:text-primary-dark transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary-light/20 dark:focus:ring-primary-dark/20 rounded-full hover:bg-surface-tertiaryLight dark:hover:bg-surface-tertiaryDark disabled:opacity-50 disabled:cursor-not-allowed"
      title="Refresh session"
      aria-label="Refresh session"
    >
      <FaSync className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
    </button>
  );
};

export default TokenRefreshIndicator;
