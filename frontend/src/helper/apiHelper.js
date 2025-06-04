import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const socketURL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const getSocketURL = () => socketURL;
