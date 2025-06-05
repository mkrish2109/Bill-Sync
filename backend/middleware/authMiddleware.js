const { sendErrorResponse } = require("../utils/serverUtils");
const { verifyJWT, verifyRefreshToken } = require("../utils/tokenUtils");

const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return sendErrorResponse(res, "Access token not provided.", 401);
    }

    try {
      const tokenUser = verifyJWT(accessToken);
      req.user = tokenUser;
      next();
    } catch (error) {
      // If access token is expired, try to refresh it
      if (error.name === 'TokenExpiredError') {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
          return sendErrorResponse(res, "Refresh token not provided.", 401);
        }

        try {
          const decoded = verifyRefreshToken(refreshToken);
          // Token is valid, but we don't need to generate new tokens here
          // The client should call the refresh endpoint to get new tokens
          return sendErrorResponse(res, "Access token expired. Please refresh.", 401);
        } catch (refreshError) {
          return sendErrorResponse(res, "Invalid refresh token.", 401);
        }
      }
      
      return sendErrorResponse(res, "Invalid access token.", 401);
    }
  } catch (error) {
    sendErrorResponse(res, "Authentication failed.", 401);
  }
};

// Middleware to check if the user is an admin
const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return sendErrorResponse(res, "Admin privileges required.", 403);
    }
    next();
  } catch (error) {
    sendErrorResponse(res, "Authorization failed.", 403);
  }
};

module.exports = { authMiddleware, adminMiddleware };