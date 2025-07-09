import React from "react";

export const ErrorAlert = ({ error, onDismiss }) => (
  <div
    className="bg-error-base/10 border-l-4 border-error-base text-error-base p-4 mb-4 rounded"
    role="alert"
  >
    <p className="font-medium">{error}</p>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="mt-2 text-error-base hover:text-error-hover font-medium transition-colors duration-200"
      >
        Dismiss
      </button>
    )}
  </div>
);

