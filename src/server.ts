import http from "http";
import app from "./app";
import initSockets from "./socket";

const PORT = process.env.PORT || 5000;

// Create HTTP server manually (required for socket.io)
const server = http.createServer(app);

// Initialize Socket.IO
initSockets(server);
console.log("🔔 Socket.IO server initialized successfully");

// Start HTTP + Socket server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
