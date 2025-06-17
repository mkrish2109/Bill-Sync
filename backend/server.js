const app = require("./app");
const { start } = require("./utils/serverUtils");
const http = require("http");
require("dotenv").config();
const PORT = process.env.PORT;
const { initializeSocket } = require("./socket");

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Make io accessible to our app
app.set("io", io);

// Start server
start(server);
