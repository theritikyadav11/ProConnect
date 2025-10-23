import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../state/authAtom";

// This is a placeholder for a real-time chat.
// For a full implementation, you would integrate WebSockets (e.g., Socket.IO)
// to send and receive messages in real-time without constant polling.

const ProjectChat = ({ projectId }) => {
  const auth = useRecoilValue(authAtom);
  const currentUser = auth.user;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      // This endpoint needs to be created on the backend
      // For now, we'll simulate it or fetch from a generic comment/discussion endpoint if available
      // Assuming a discussion endpoint for projects will be added to MicroProjectController
      const response = await api.get(
        `/api/microprojects/${projectId}/discussion`
      );
      setMessages(response.data); // Assuming response.data is an array of messages
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch messages.");
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Set up polling for new messages (replace with WebSockets in a real app)
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    setError("");
    try {
      // This endpoint needs to be created on the backend
      // Assuming a discussion endpoint for projects will be added to MicroProjectController
      const response = await api.post(
        `/api/microprojects/${projectId}/discussion`,
        {
          content: newMessage,
          sender: currentUser._id,
        }
      );
      setMessages((prevMessages) => [...prevMessages, response.data]); // Add new message to state
      setNewMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-96 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-600 text-center">
            No messages yet. Start the discussion!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`flex ${
                msg.sender._id === currentUser._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.sender._id === currentUser._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="font-semibold text-sm mb-1">
                  {msg.sender.name || "Unknown User"}
                </p>
                <p>{msg.content}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200 flex"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ProjectChat;
