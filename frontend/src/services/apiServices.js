import { api } from "../api";

export const verifyEmail = async (data) => {
  try {
    console.log("Verifying email with data: ", data);
    
    const response = await api.post('/verify-email', data);
    return response.data; // Assuming your backend responds with { success, message }
  } catch (error) {
    console.error("Verification failed: ", error.message);
    return { success: false, message: "Something went wrong." }; // Fallback response
  }
};


export const login = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data; // payload will be available as .payload in thunk
  };
  
  export const logout = async () => {
    const response = await api.post("/auth/logout"); // or your logout logic
    return response.data;
  };