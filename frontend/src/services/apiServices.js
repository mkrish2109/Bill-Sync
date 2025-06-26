import { api } from "../helper/apiHelper";

export const forgotPassword = async (data) => {
  try {
    const response = await api.post("/auth/forgot-password", data);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send reset password email"
    );
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post("/auth/reset-password", data);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};

// --- User API ---
export const getUserById = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
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

// --- Requests API ---
export const getAvailableWorkers = async () => {
  try {
    const response = await api.get("/requests/available/workers");
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch available workers"
    );
  }
};

export const sendRequest = async (requestData) => {
  try {
    const response = await api.post("/requests", requestData);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send request");
  }
};

export const acceptRequest = async (requestId) => {
  try {
    const response = await api.put(`/requests/${requestId}/accept`);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to accept request"
    );
  }
};

export const rejectRequest = async (requestId) => {
  try {
    const response = await api.put(`/requests/${requestId}/reject`);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reject request"
    );
  }
};

export const cancelRequest = async (requestId) => {
  try {
    const response = await api.put(`/requests/${requestId}/cancel`);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to cancel request"
    );
  }
};

export const getUserRequests = async () => {
  try {
    const response = await api.get("/requests");
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user requests"
    );
  }
};
