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
  const currentUserId = currentUser?._id || currentUser?.id;

  // Fetch matches
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

  // Join room and load messages when user selected
  useEffect(() => {
    if (!selectedUser) return;

    const selectedUserId = selectedUser._id || selectedUser.id;
    const roomId = [currentUserId, selectedUserId].sort().join("_");

    // Join socket room
    socket.emit("join_room", roomId);

    // Load chat history
    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/${selectedUserId}`,
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

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;
    const selectedUserId = selectedUser._id || selectedUser.id;
    socket.emit("send_message", {
      senderId: currentUserId,
      receiverId: selectedUserId,
      message: newMessage.trim(),
    });
    setNewMessage("");
  };

  // Check if message is from current user
  const isMyMessage = (msg) => {
    const msgSenderId =
      msg.senderId || msg.sender?._id || msg.sender?.id || msg.sender;
    return String(msgSenderId) === String(currentUserId);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 120px)",
        background: "#fff",
        borderRadius: "20px",
        border: "2px solid #EDE9FE",
        boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
        overflow: "hidden",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* LEFT — Contacts Sidebar */}
      <div
        style={{
          width: "260px",
          borderRight: "2px solid #EDE9FE",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div
          style={{ padding: "18px 16px", borderBottom: "2px solid #EDE9FE" }}
        >
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
                No matches yet!
              </p>
            </div>
          )}

          {matches.map((match, i) => {
            const isSelected =
              selectedUser &&
              (selectedUser._id === match.user._id ||
                selectedUser.id === match.user._id);
            return (
              <div
                key={i}
                onClick={() => setSelectedUser(match.user)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  background: isSelected ? "#F5F3FF" : "transparent",
                  borderBottom: "1px solid #F3F4F6",
                  borderLeft: isSelected
                    ? "3px solid #7C3AED"
                    : "3px solid transparent",
                  transition: "all 0.2s",
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
                      color: isSelected ? "#7C3AED" : "#1E1B4B",
                      marginBottom: "2px",
                    }}
                  >
                    {match.user.name}
                  </p>
                  <p style={{ fontSize: "11px", color: "#9CA3AF" }}>
                    {match.matchPercent}% match
                  </p>
                </div>
                <span
                  style={{
                    background: "#F5F3FF",
                    color: "#7C3AED",
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "2px 7px",
                    borderRadius: "8px",
                    border: "1px solid #DDD6FE",
                    flexShrink: 0,
                  }}
                >
                  {match.matchPercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT — Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#FAFAFE",
        }}
      >
        {!selectedUser ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
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
            <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
              Choose a match from the left to start chatting!
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "2px solid #EDE9FE",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "#fff",
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
                  flexShrink: 0,
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
                <p
                  style={{
                    fontSize: "12px",
                    color: "#10B981",
                    fontWeight: "500",
                  }}
                >
                  ● Online
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {messages.length === 0 && (
                <div style={{ textAlign: "center", marginTop: "60px" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                    👋
                  </div>
                  <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
                    Say hi to {selectedUser.name}!
                  </p>
                  <p
                    style={{
                      color: "#C4B5FD",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    Start the conversation below
                  </p>
                </div>
              )}

              {messages.map((msg, i) => {
                const mine = isMyMessage(msg);
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: mine ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                      gap: "8px",
                    }}
                  >
                    {/* Avatar for received messages */}
                    {!mine && (
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #7C3AED, #EC4899)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: "11px",
                          flexShrink: 0,
                          marginBottom: "2px",
                        }}
                      >
                        {selectedUser.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}

                    <div style={{ maxWidth: "60%" }}>
                      {/* Sender name for received */}
                      {!mine && (
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#9CA3AF",
                            marginBottom: "3px",
                            paddingLeft: "4px",
                            fontWeight: "500",
                          }}
                        >
                          {selectedUser.name}
                        </p>
                      )}

                      {/* Message bubble */}
                      <div
                        style={{
                          padding: "10px 16px",
                          borderRadius: mine
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                          background: mine
                            ? "linear-gradient(135deg, #7C3AED, #EC4899)"
                            : "#fff",
                          color: mine ? "#fff" : "#1E1B4B",
                          fontSize: "14px",
                          lineHeight: 1.5,
                          boxShadow: mine
                            ? "0 4px 12px rgba(124,58,237,0.3)"
                            : "0 2px 8px rgba(0,0,0,0.06)",
                          border: mine ? "none" : "1.5px solid #EDE9FE",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.message}
                      </div>

                      {/* Timestamp */}
                      <p
                        style={{
                          fontSize: "10px",
                          color: "#C4B5FD",
                          marginTop: "3px",
                          textAlign: mine ? "right" : "left",
                          paddingLeft: mine ? 0 : "4px",
                          paddingRight: mine ? "4px" : 0,
                        }}
                      >
                        {new Date(
                          msg.createdAt || Date.now(),
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Avatar for sent messages */}
                    {mine && (
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #7C3AED, #EC4899)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: "11px",
                          flexShrink: 0,
                          marginBottom: "2px",
                        }}
                      >
                        {currentUser?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: "14px 20px",
                borderTop: "2px solid #EDE9FE",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                background: "#fff",
              }}
            >
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
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
                  padding: "12px 22px",
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
                  whiteSpace: "nowrap",
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
