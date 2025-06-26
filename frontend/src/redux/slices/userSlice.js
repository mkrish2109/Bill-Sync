import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { authAPI, stopBackgroundTokenRefresh } from "../../utils/api";

// Async thunks
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      console.log(response);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Stop background token refresh before logout
      stopBackgroundTokenRefresh();
      const response = await authAPI.logout();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Logout failed" }
      );
    }
  }
);

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyAuth();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user" }
      );
    }
  }
);

export const restoreUser = createAsyncThunk(
  "user/restoreUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyAuth();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to refresh token" }
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: true,
    user: null,
    error: "",
    isAuthenticated: false,
    message: "",
  },
  reducers: {
    clearError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.message = action.payload?.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Login failed";
        toast.error(state.error);
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.error = "";
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Failed to fetch user";
        toast.error(state.error);
      })
      .addCase(restoreUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.error = "";
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Failed to restore user";
        toast.error(state.error);
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = action.payload?.message || "Logged out successfully";
        state.error = "";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed";
        toast.error(state.error);
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
