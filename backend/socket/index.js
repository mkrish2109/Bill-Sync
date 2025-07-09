const { createSocketServer } = require("./config");
const { socketAuthMiddleware } = require("./middleware");
const { handleJoinRoom, handleGetRooms } = require("./roomHandlers");
const {
  handleDisconnect,
  handleError,
  handleReconnectAttempt,
  handleReconnect,
  handleReconnectError,
  handleReconnectFailed,
  handlePing,
  handleClientPing,
} = require("./connectionHandlers");

const initializeSocket = (server) => {
  const io = createSocketServer(server);

  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  // Handle connections
  io.on("connection", (socket) => {
    // Room management
    socket.on("join_room", (userId, callback) =>
      handleJoinRoom(socket, userId, callback)
    );
    socket.on("get_rooms", (callback) => handleGetRooms(socket, callback));

    // Connection events
    socket.on("disconnect", (reason) => handleDisconnect(socket, reason));
    socket.on("error", (error) => handleError(socket, error));
    socket.on("reconnect_attempt", (attemptNumber) =>
      handleReconnectAttempt(socket, attemptNumber)
    );
    socket.on("reconnect", (attemptNumber) =>
      handleReconnect(socket, attemptNumber)
    );
    socket.on("reconnect_error", (error) =>
      handleReconnectError(socket, error)
    );
    socket.on("reconnect_failed", () => handleReconnectFailed(socket));

    // Health check
    socket.on("ping", () => handlePing(socket));
    socket.on("client_ping", () => handleClientPing(socket));
  });

  return io;
};

module.exports = { initializeSocket };
