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
    
    next();
  } catch (error) {
    sendErrorResponse(res, "Authentication failed.", 401);
  }
};

module.exports = { authMiddleware };