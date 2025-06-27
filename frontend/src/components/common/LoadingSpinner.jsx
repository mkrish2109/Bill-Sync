import React from "react";

const LoadingSpinner = ({
  size = "md",
  text = "",
  color = "primary",
  className = "",
  inline = false
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  const colorClasses = {
    primary: "border-primary-light dark:border-primary-dark",
    secondary: "border-secondary-light dark:border-secondary-dark",
    gray: "border-gray-300 dark:border-gray-600",
    white: "border-white",
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
  };

  // For inline spinners (buttons, forms)
  if (inline) {
    return (
      <span className="flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {text}
      </span>
    );
  }

  return (
    <div className={`flex flex-col justify-center items-center min-h-screen w-full ${className}`}>
      <div className="relative">
        {/* Main spinner */}
        <div
          className={`animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700 ${sizeClasses[size]} ${colorClasses[color]}`}
          style={{
            borderTopColor: "transparent",
            borderRightColor: "transparent",
          }}
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>

        {/* Optional inner pulse effect */}
        <div
          className={`absolute inset-0 rounded-full animate-ping opacity-20 ${colorClasses[color]}`}
          style={{ borderWidth: "2px" }}
        />
      </div>

      {/* Optional loading text */}
      {text && (
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
            {text}
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
