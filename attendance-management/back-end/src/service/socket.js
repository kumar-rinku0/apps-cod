import { Server } from "socket.io";

// Initialize Socket.io
const io = new Server();

// Set up Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on('send_message', (messageData) => {
    console.log('Message received:', messageData);
    io.emit('new_message', messageData);  // Emit message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export { io };
