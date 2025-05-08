import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    user: userSliceReducer,
  },
});

export default store;
