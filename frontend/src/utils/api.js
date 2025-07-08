import toast from "react-hot-toast";
import { api } from "../helper/apiHelper";
import { toastInfo } from "./toastHelpers";

// --- Token Refresh Utilities ---
let refreshPromise = null;
let refreshTimer = null;
let isRefreshing = false;
let isPageVisible = true;
let lastActivityTime = Date.now();
let activityTimeout = null;

// Track user activity for refresh logic
const trackUserActivity = () => {
  lastActivityTime = Date.now();
  if (activityTimeout) clearTimeout(activityTimeout);
  activityTimeout = setTimeout(() => {
    console.log(
      "User inactive for 30 minutes, will refresh token on next activity"
    );
  }, 30 * 60 * 1000);
};
const shouldRefreshOnActivity = () =>
  Date.now() - lastActivityTime > 25 * 60 * 1000;
const getDefaultTimeUntilExpiry = () => 55 * 60 * 1000; // 55 minutes

// Get time until token expires (ms)
const getTimeUntilExpiry = async () => {
  try {
    const response = await api.get("/auth/token-expiry");
    if (response.data.success) {
      const { timeUntilExpiry } = response.data.data;
      const ms = timeUntilExpiry * 1000;
      const buffer = 5 * 60 * 1000;
      return Math.max(ms - buffer, 60000);
    }
    return getDefaultTimeUntilExpiry();
  } catch {
    return getDefaultTimeUntilExpiry();
  }
};

// Schedule background token refresh
const scheduleTokenRefresh = async () => {
  if (refreshTimer) clearTimeout(refreshTimer);
  if (!isPageVisible) return;
  const refreshTime = await getTimeUntilExpiry();
  refreshTimer = setTimeout(async () => {
    try {
      await refreshTokenSilently();
      scheduleTokenRefresh();
    } catch {}
  }, refreshTime);
};

// Silently refresh token
const refreshTokenSilently = async () => {
  if (isRefreshing) return refreshPromise;
  isRefreshing = true;
  refreshPromise = api.post("/auth/refresh");
  try {
    await refreshPromise;
    toastInfo("Session refreshed automatically", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  } catch (error) {
    // If refresh fails, stop timers and redirect to login
    stopBackgroundTokenRefresh();
    toast.error("Session expired. Please log in again.", {
      position: "top-right",
      autoClose: 3000,
    });
    window.location.href = "/login";
    throw error; // rethrow for manualTokenRefresh to handle
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

// Manual refresh for components
export const manualTokenRefresh = async () => {
  try {
    await refreshTokenSilently();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Start/stop background refresh
export const startBackgroundTokenRefresh = () => {
  const handleVisibilityChange = () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) {
      if (shouldRefreshOnActivity()) {
        refreshTokenSilently().then(scheduleTokenRefresh);
      } else {
        scheduleTokenRefresh();
      }
    } else if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  };
  [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ].forEach((e) => document.addEventListener(e, trackUserActivity, true));
  document.addEventListener("visibilitychange", handleVisibilityChange);
  scheduleTokenRefresh();
};
export const stopBackgroundTokenRefresh = () => {
  if (refreshTimer) clearTimeout(refreshTimer);
  if (activityTimeout) clearTimeout(activityTimeout);
  isRefreshing = false;
  refreshPromise = null;
  [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ].forEach((e) => document.removeEventListener(e, trackUserActivity, true));
  document.removeEventListener("visibilitychange", () => {});
};

// Axios interceptors for auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const loadingToast = toast.loading("Refreshing session...", {
          position: "top-right",
        });
        await api.post("/auth/refresh");
        toast.dismiss(loadingToast);
        toast.success("Session refreshed successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        startBackgroundTokenRefresh();
        return api(originalRequest);
      } catch (refreshError) {
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        stopBackgroundTokenRefresh();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API (for direct use, or use apiServices.js for business logic)
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  verifyAuth: () => api.get("/auth/verify-auth"),
};

// Export the api instance for custom calls
export default api;
