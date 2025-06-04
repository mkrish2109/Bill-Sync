const app = require("./app");
const { start } = require("./utils/serverUtils");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();
const PORT = process.env.PORT;
const { verifyJWT } = require("./utils/tokenUtils");

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with more robust configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  allowEIO3: true,
  transports: ["websocket", "polling"],
  path: "/socket.io/",
  serveClient: false,
  cookie: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.error("Socket authentication error: Token not provided");
    return next(new Error("Authentication error: Token not provided"));
  }

  try {
    const decoded = verifyJWT(token);
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("Socket authentication error:", err);
    return next(new Error("Authentication error: Invalid token"));
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.user.userId}`);

  // Join user's room for private messages
  socket.on("join_room", (userId, callback) => {
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
        if (callback)
          callback({ success: false, error: "Failed to join room" });
      }
    } else {
      console.error(`Unauthorized room join attempt: ${userId}`);
      if (callback) callback({ success: false, error: "Unauthorized" });
    }
  });

  // Handle get_rooms request
  socket.on("get_rooms", (callback) => {
    if (typeof callback === "function") {
      const rooms = Array.from(socket.rooms);
      callback(rooms);
    }
  });

  // Handle disconnect
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.user.userId}, Reason: ${reason}`);
  });

  // Handle error
  socket.on("error", (error) => {
    console.error(`Socket error for user ${socket.user.userId}:`, error);
  });

  // Handle reconnection
  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(
      `Reconnection attempt ${attemptNumber} for user ${socket.user.userId}`
    );
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(
      `User ${socket.user.userId} reconnected after ${attemptNumber} attempts`
    );
    // Automatically rejoin the room after reconnection
    socket.emit("join_room", socket.user.userId);
  });

  socket.on("reconnect_error", (error) => {
    console.error(`Reconnection error for user ${socket.user.userId}:`, error);
  });

  socket.on("reconnect_failed", () => {
    console.error(`Failed to reconnect for user ${socket.user.userId}`);
  });

  // Handle ping/pong for connection health check
  socket.on("ping", () => {
    socket.emit("pong");
  });

  // Handle client-side ping
  socket.on("client_ping", () => {
    socket.emit("client_pong");
  });
});

// Make io accessible to our app
app.set("io", io);

// Start server
start(server);
