import React, { useState, useEffect } from "react";
import { listenForNewMessages } from "../../services/socket";

function App() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // Listen for new messages from the server
    listenForNewMessages((newMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup socket listeners when the component unmounts
    return () => {
      disconnectSocket(); // Properly disconnect and clean up listeners
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const handleSendMessage = () => {
    if (message.trim()) {
      const messageData = {
        sender: "User", // Replace with dynamic user data if needed
        message: message,
      };
      setMessage(""); // Clear the input field after sending the message
    }
  };

  return (
    <div className="App">
      <h1>Real-time Chat</h1>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <ul>
        {chatMessages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
