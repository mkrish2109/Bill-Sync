import { api } from "../helper/apiHelper";

export const login = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Logout failed");
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send reset password email"
    );
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};

export const getUserById = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const getAvailableWorkers = () => api.get('/requests/available/workers');
export const sendRequest = (requestData) => api.post('/requests', requestData);
export const acceptRequest = (requestId) => api.put(`/requests/${requestId}/accept`);
export const rejectRequest = (requestId) => api.put(`/requests/${requestId}/reject`);
export const cancelRequest = (requestId) => api.put(`/requests/${requestId}/cancel`);
export const getUserRequests = () => api.get('/requests');