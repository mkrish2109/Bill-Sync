const app = require('./app');
const { start } = require('./utils/serverUtils');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();
const PORT = process.env.PORT;
const { verifyJWT } = require('./utils/tokenUtils');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with more robust configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  allowEIO3: true,
  transports: ['websocket', 'polling'],
  path: '/socket.io/',
  serveClient: false,
  cookie: false
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token not provided'));
  }

  try {
    const decoded = verifyJWT(token);
    socket.user = decoded;
    next();
  } catch (err) {
    console.error('Socket authentication error:', err);
    return next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  // Join user's room for private messages
  socket.on('join_room', (userId, callback) => {
    if (socket.user.userId === userId) {
      // Leave any existing rooms first
      const currentRooms = Array.from(socket.rooms);
      currentRooms.forEach(room => {
        if (room !== socket.id) { // Don't leave the socket's own room
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
        if (callback) callback({ success: false, error: 'Failed to join room' });
      }
    } else {
      console.error(`Unauthorized room join attempt: ${userId}`);
      if (callback) callback({ success: false, error: 'Unauthorized' });
    }
  });

  // Handle get_rooms request
  socket.on('get_rooms', (callback) => {
    if (typeof callback === 'function') {
      const rooms = Array.from(socket.rooms);
      callback(rooms);
    }
  });

  socket.on('disconnect', (reason) => {
    console.error('User disconnected:', socket.user.userId, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Make io accessible to our app
app.set('io', io);

// Start server
start(server);