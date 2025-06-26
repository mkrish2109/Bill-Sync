import { useCallback } from "react";
import { manualTokenRefresh } from "../utils/api";

export const useTokenRefresh = () => {
  const refreshToken = useCallback(async () => {
    try {
      const result = await manualTokenRefresh();
      return result.success;
    } catch (error) {
      console.error("Manual token refresh failed:", error);
      return false;
    }
  }, []);

  return { refreshToken };
};
