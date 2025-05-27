import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout, getUserById } from "../../services/apiServices";

// Shared fetch logic
const fetchUserData = async (userId) => {
  const user = await getUserById(userId);
  return user;
};

// Async Thunks
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await login(data);
      console.log(res);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const restoreUser = createAsyncThunk(
  "user/restoreUser",
  async (_, { rejectWithValue }) => {
    try {
      const expiry = localStorage.getItem("tokenExpiry");
      const userId = localStorage.getItem("userId");

      if (!userId || !expiry || Date.now() > Number(expiry)) {
        localStorage.removeItem("userId");
        localStorage.removeItem("tokenExpiry");
        return null;
      }

      return await fetchUserData(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchUserData(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
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
    message: ""
  },
  reducers: {
    clearError: (state) => {
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const expiry = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
        state.user = action.payload.data;
        state.loading = false;
        state.error = "";
        state.message = action.payload.message;
        state.isAuthenticated = true;

        localStorage.setItem("userId", action.payload.data.userId);
        localStorage.setItem("role",action.payload.data.role)
        localStorage.setItem("tokenExpiry", expiry);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Failed to fetch user";
      })
      .addCase(restoreUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Session expired";
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("tokenExpiry");
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = "Logged out successfully";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed";
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;