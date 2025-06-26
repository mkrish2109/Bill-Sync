import axios from "axios";

// Centralized Axios instance for all API calls
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const socketURL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Helper to get the socket server URL
export const getSocketURL = () => socketURL;
