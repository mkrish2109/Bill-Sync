const handleJoinRoom = (socket, userId, callback) => {
  if (socket.user.userId === userId) {
    // Leave any existing rooms first
    const currentRooms = Array.from(socket.rooms);

    currentRooms.forEach((room) => {
      if (room !== socket.id) {
        // Don't leave the socket's own room
        socket.leave(room);
      }
    });

    // Join the new room
    socket.join(userId);

    // Verify room was joined
    const rooms = Array.from(socket.rooms);

    if (rooms.includes(userId)) {
      if (callback) callback({ success: true });
    } else {
      console.error(`Failed to join room for user ${userId}`);
      if (callback) callback({ success: false, error: "Failed to join room" });
    }
  } else {
    console.error(`Unauthorized room join attempt: ${userId}`);
    if (callback) callback({ success: false, error: "Unauthorized" });
  }
};

const handleGetRooms = (socket, callback) => {
  if (typeof callback === "function") {
    const rooms = Array.from(socket.rooms);
    callback(rooms);
  }
};

module.exports = {
  handleJoinRoom,
  handleGetRooms,
};
