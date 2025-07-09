const handleDisconnect = (socket, reason) => {
  // console.log(`User disconnected: ${socket.user.userId}, Reason: ${reason}`);
};

const handleError = (socket, error) => {
  console.error(`Socket error for user ${socket.user.userId}:`, error);
};

const handleReconnectAttempt = (socket, attemptNumber) => {
  // console.log(`Reconnection attempt ${attemptNumber} for user ${socket.user.userId}`);
};

const handleReconnect = (socket, attemptNumber) => {
  // console.log(`User ${socket.user.userId} reconnected after ${attemptNumber} attempts`);
  // Automatically rejoin the room after reconnection
  socket.emit("join_room", socket.user.userId);
};

const handleReconnectError = (socket, error) => {
  console.error(`Reconnection error for user ${socket.user.userId}:`, error);
};

const handleReconnectFailed = (socket) => {
  console.error(`Failed to reconnect for user ${socket.user.userId}`);
};

const handlePing = (socket) => {
  socket.emit("pong");
};

const handleClientPing = (socket) => {
  socket.emit("client_pong");
};

module.exports = {
  handleDisconnect,
  handleError,
  handleReconnectAttempt,
  handleReconnect,
  handleReconnectError,
  handleReconnectFailed,
  handlePing,
  handleClientPing,
};
