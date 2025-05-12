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
    return response.data;
  };
  
  export const logout = async () => {
    const response = await api.post("/auth/logout"); // or your logout logic
    if (response.status !== 200) {
      throw new Error("Failed to log out");
    }
    return response.data;
  };

export const getAllUsers = async () => {
  const response = await api.get("/admin/users",{
    withCredentials: true, 
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetch users");
  }
  return response.data; 
}