const { sendErrorResponse } = require("../utils/serverUtils");
const { verifyJWT } = require("../utils/tokenUtils");

const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    

    if (!accessToken) {
      return sendErrorResponse(res, "Token not provided.", 401);
    }
    const tokenUser = verifyJWT(accessToken);
    
    req.user = tokenUser;
    if (!req.user) {
      return sendErrorResponse(res, "Invalid token.", 401);
    }
    // console.log(req.user);
    next();
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

module.exports = { authMiddleware , adminMiddleware };