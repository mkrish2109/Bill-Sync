// WorkerAuthGuard.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";

function WorkerAuthGuard({ children }) {
  const { user, loading } = useSelector((store) => store.user);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "worker") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default WorkerAuthGuard; 