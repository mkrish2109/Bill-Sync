const { verifyJWT } = require("../utils/tokenUtils");

const socketAuthMiddleware = (socket, next) => {
  const cookies = socket.handshake.headers.cookie;
  if (!cookies) {
    return next(new Error("Authentication error: No cookies found"));
  }

  const accessToken = cookies
    .split(";")
    .find((c) => c.trim().startsWith("accessToken="))
    ?.split("=")[1];

  if (!accessToken) {
    return next(new Error("Authentication error: No access token found"));
  }

  try {
    const decoded = verifyJWT(accessToken);
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("Socket authentication error:", err);
    return next(new Error("Authentication error: Invalid token"));
  }
};

module.exports = { socketAuthMiddleware };
