import React, { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  startBackgroundTokenRefresh,
  stopBackgroundTokenRefresh,
} from "../utils/api";
import { restoreUser } from "../store/slices/userSlice";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(restoreUser()).unwrap();
      } catch (error) {
        console.error("Failed to restore user session:", error);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Start/stop background token refresh based on authentication status
  useEffect(() => {
    if (isAuthenticated && user) {
      // Start background token refresh when user is authenticated
      // console.log("Starting background token refresh");
      startBackgroundTokenRefresh();
    } else {
      // Stop background token refresh when user is not authenticated
      // console.log("Stopping background token refresh");
      stopBackgroundTokenRefresh();
    }

    // Cleanup function to stop refresh when component unmounts
    return () => {
      stopBackgroundTokenRefresh();
    };
  }, [isAuthenticated, user]);

  const value = {
    user,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
