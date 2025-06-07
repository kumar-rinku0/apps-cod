import { io } from "socket.io-client";

const socket = io("/api");

// Listen for new messages
const listenForNewMessages = (callback) => {
  if (!socket) {
    console.error("Socket not initialized");
    return;
  }

  socket.on("new_message", callback); // Correct event name here
};

// Listen for new notes (if needed)
const listenForNewNotes = (callback) => {
  if (!socket) {
    console.error("Socket not initialized");
    return;
  }

  socket.on("new_note", callback); // Correct event name here
};

export { listenForNewMessages, listenForNewNotes };
