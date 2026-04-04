import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat({ initialUser }) {
  const [matches, setMatches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(initialUser || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fetch matches to show in sidebar
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/matches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(res.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchMatches();
  }, [token]);

  // Join room and listen for messages
  useEffect(() => {
    if (!selectedUser) return;

    const roomId = [currentUser._id, selectedUser._id].sort().join("_");
    socket.emit("join_room", roomId);

    // Load chat history
    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/${selectedUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setMessages(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    loadMessages();

    // Listen for new messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    socket.emit("send_message", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Styles
  const containerStyle = {
    display: "flex",
    height: "calc(100vh - 120px)",
    background: "#fff",
    borderRadius: "20px",
    border: "2px solid #EDE9FE",
    boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
    overflow: "hidden",
    fontFamily: "Poppins, sans-serif",
  };

  const sidebarStyle = {
    width: "280px",
    borderRight: "2px solid #EDE9FE",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  };

  const chatAreaStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={containerStyle}>
      {/* LEFT — Contacts */}
      <div style={sidebarStyle}>
        <div style={{ padding: "20px", borderBottom: "2px solid #EDE9FE" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1E1B4B" }}>
            💬 Messages
          </h3>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
            Your matched users
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && (
            <p
              style={{
                textAlign: "center",
                padding: "20px",
                color: "#9CA3AF",
                fontSize: "13px",
              }}
            >
              Loading...
            </p>
          )}

          {!loading && matches.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>🤝</div>
              <p style={{ color: "#9CA3AF", fontSize: "13px" }}>
                No matches yet! Add skills to get matched.
              </p>
            </div>
          )}

          {matches.map((match, i) => (
            <div
              key={i}
              onClick={() => setSelectedUser(match.user)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                cursor: "pointer",
                background:
                  selectedUser?._id === match.user._id
                    ? "#F5F3FF"
                    : "transparent",
                borderBottom: "1px solid #F3F4F6",
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "16px",
                  flexShrink: 0,
                }}
              >
                {match.user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1E1B4B",
                    marginBottom: "2px",
                  }}
                >
                  {match.user.name}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#9CA3AF",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {match.matchPercent}% match
                </p>
              </div>
              <span
                style={{
                  background: "#F5F3FF",
                  color: "#7C3AED",
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  border: "1px solid #DDD6FE",
                }}
              >
                {match.matchPercent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Chat Area */}
      <div style={chatAreaStyle}>
        {!selectedUser ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>💬</div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1E1B4B",
                marginBottom: "6px",
              }}
            >
              Select a conversation
            </h3>
            <p style={{ fontSize: "13px" }}>
              Choose a match from the left to start chatting!
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "2px solid #EDE9FE",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "15px",
                }}
              >
                {selectedUser.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#1E1B4B",
                  }}
                >
                  {selectedUser.name}
                </p>
                <p style={{ fontSize: "12px", color: "#10B981" }}>● Online</p>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.length === 0 && (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                    👋
                  </div>
                  <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
                    Say hi to {selectedUser.name}!
                  </p>
                </div>
              )}

              {messages.map((msg, i) => {
                const isMe =
                  (msg.senderId ||
                    msg.sender?._id?.toString() ||
                    msg.sender?.toString()) === currentUser._id;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: isMe ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "65%",
                        padding: "10px 16px",
                        borderRadius: isMe
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                        background: isMe
                          ? "linear-gradient(135deg, #7C3AED, #EC4899)"
                          : "#F5F3FF",
                        color: isMe ? "#fff" : "#1E1B4B",
                        fontSize: "14px",
                        lineHeight: 1.5,
                        boxShadow: isMe
                          ? "0 4px 12px rgba(124,58,237,0.3)"
                          : "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                    >
                      {msg.message}
                      <div
                        style={{
                          fontSize: "10px",
                          opacity: 0.6,
                          marginTop: "4px",
                          textAlign: "right",
                        }}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "2px solid #EDE9FE",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selectedUser.name}...`}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "2px solid #EDE9FE",
                  borderRadius: "12px",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "Poppins, sans-serif",
                  background: "#F5F3FF",
                  color: "#1E1B4B",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                style={{
                  padding: "12px 20px",
                  background: newMessage.trim()
                    ? "linear-gradient(135deg, #7C3AED, #EC4899)"
                    : "#EDE9FE",
                  color: newMessage.trim() ? "#fff" : "#9CA3AF",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: newMessage.trim() ? "pointer" : "not-allowed",
                  fontFamily: "Poppins, sans-serif",
                  transition: "all 0.2s",
                }}
              >
                Send →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
