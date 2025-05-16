// UserAuthGuard.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner"; // Create or import a loading component

function UserAuthGuard({ children }) {
  const { user, loading } = useSelector((store) => store.user);

  if (loading) {
    return <LoadingSpinner />; // Show loading state while checking auth
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default UserAuthGuard;