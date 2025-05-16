import axios from 'axios';
const baseURL = "http://localhost:5000/api";
export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, 
});
