import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const C = {
  blue:         "#BDE8FF",
  lavender:     "#D8C9FF",
  pink:         "#FFB3CC",
  yellow:       "#FFFAB3",
  lavenderDark: "#7C5CBF",
  pinkDark:     "#D45580",
  blueDark:     "#4BA8D4",
  text:         "#2D2040",
  muted:        "#8B7DAA",
  border:       "#E8DFFF",
  bg:           "#F6F3FF",
  white:        "#FFFFFF",
};

function Chat({ initialUser }) {
  const [matches, setMatches]         = useState([]);
  const [selectedUser, setSelectedUser] = useState(initialUser || null);
  const [messages, setMessages]       = useState([]);
  const [newMessage, setNewMessage]   = useState("");
  const [loading, setLoading]         = useState(true);
  const messagesEndRef                = useRef(null);

  const currentUser   = JSON.parse(localStorage.getItem("user"));
  const token         = localStorage.getItem("token");
  const currentUserId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/matches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(res.data);
      } catch (e) { console.log(e); }
      setLoading(false);
    };
    fetchMatches();
  }, [token]);

  useEffect(() => {
    if (!selectedUser) return;
    const selectedUserId = selectedUser._id || selectedUser.id;
    const roomId = [currentUserId, selectedUserId].sort().join("_");
    socket.emit("join_room", roomId);

    const loadMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/${selectedUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (e) { console.log(e); }
    };
    loadMessages();

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => { socket.off("receive_message"); };
  }, [selectedUser]);

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

  const isMyMessage = (msg) => {
    const msgSenderId = msg.senderId || msg.sender?._id || msg.sender?.id || msg.sender;
    return String(msgSenderId) === String(currentUserId);
  };

  return (
    <div style={{
      display: "flex", height: "calc(100vh - 120px)",
      background: C.white, borderRadius: "20px",
      border: `2px solid ${C.border}`,
      boxShadow: `0 4px 20px rgba(124,92,191,0.08)`,
      overflow: "hidden", fontFamily: "Poppins, sans-serif",
    }}>

      {/* LEFT — Contacts */}
      <div style={{
        width: "260px", borderRight: `2px solid ${C.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        <div style={{ padding: "18px 16px", borderBottom: `2px solid ${C.border}` }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: C.text }}>💬 Messages</h3>
          <p style={{ fontSize: "12px", color: C.muted, marginTop: "2px" }}>Your matched users</p>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && (
            <p style={{ textAlign: "center", padding: "20px", color: C.muted, fontSize: "13px" }}>
              Loading...
            </p>
          )}
          {!loading && matches.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>🤝</div>
              <p style={{ color: C.muted, fontSize: "13px" }}>No matches yet!</p>
            </div>
          )}
          {matches.map((match, i) => {
            const isSelected = selectedUser &&
              (selectedUser._id === match.user._id || selectedUser.id === match.user._id);
            return (
              <div key={i} onClick={() => setSelectedUser(match.user)} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 16px", cursor: "pointer",
                background: isSelected ? `${C.lavender}55` : "transparent",
                borderBottom: `1px solid ${C.border}`,
                borderLeft: isSelected ? `3px solid ${C.lavenderDark}` : "3px solid transparent",
                transition: "all 0.2s",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: C.lavenderDark, fontWeight: "700", fontSize: "15px", flexShrink: 0,
                }}>{match.user.name?.charAt(0)?.toUpperCase()}</div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{
                    fontSize: "14px", fontWeight: "600",
                    color: isSelected ? C.lavenderDark : C.text, marginBottom: "2px",
                  }}>{match.user.name}</p>
                  <p style={{ fontSize: "11px", color: C.muted }}>{match.matchPercent}% match</p>
                </div>
                <span style={{
                  background: C.lavender, color: C.lavenderDark,
                  fontSize: "10px", fontWeight: "700",
                  padding: "2px 7px", borderRadius: "8px",
                  border: `1px solid ${C.lavenderDark}33`, flexShrink: 0,
                }}>{match.matchPercent}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT — Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: `${C.bg}` }}>
        {!selectedUser ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>💬</div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: C.text, marginBottom: "6px" }}>
              Select a conversation
            </h3>
            <p style={{ fontSize: "13px", color: C.muted }}>
              Choose a match from the left to start chatting!
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{
              padding: "14px 20px", borderBottom: `2px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: "12px",
              background: C.white,
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.lavenderDark, fontWeight: "700", fontSize: "15px", flexShrink: 0,
              }}>{selectedUser.name?.charAt(0)?.toUpperCase()}</div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: "700", color: C.text }}>{selectedUser.name}</p>
                <p style={{ fontSize: "12px", color: "#3DBE8A", fontWeight: "500" }}>● Online</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "20px",
              display: "flex", flexDirection: "column", gap: "10px",
            }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", marginTop: "60px" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>👋</div>
                  <p style={{ color: C.muted, fontSize: "14px" }}>Say hi to {selectedUser.name}!</p>
                  <p style={{ color: C.lavender, fontSize: "12px", marginTop: "4px" }}>Start the conversation below</p>
                </div>
              )}

              {messages.map((msg, i) => {
                const mine = isMyMessage(msg);
                return (
                  <div key={i} style={{
                    display: "flex", justifyContent: mine ? "flex-end" : "flex-start",
                    alignItems: "flex-end", gap: "8px",
                  }}>
                    {!mine && (
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: C.lavenderDark, fontWeight: "700", fontSize: "11px",
                        flexShrink: 0, marginBottom: "2px",
                      }}>{selectedUser.name?.charAt(0)?.toUpperCase()}</div>
                    )}

                    <div style={{ maxWidth: "60%" }}>
                      {!mine && (
                        <p style={{
                          fontSize: "11px", color: C.muted, marginBottom: "3px",
                          paddingLeft: "4px", fontWeight: "500",
                        }}>{selectedUser.name}</p>
                      )}
                      <div style={{
                        padding: "10px 16px",
                        borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: mine
                          ? `linear-gradient(135deg, ${C.lavender}, ${C.pink})`
                          : C.white,
                        color: mine ? C.lavenderDark : C.text,
                        fontSize: "14px", lineHeight: 1.5,
                        boxShadow: mine
                          ? `0 4px 12px ${C.lavender}88`
                          : `0 2px 8px rgba(0,0,0,0.06)`,
                        border: mine ? "none" : `1.5px solid ${C.border}`,
                        wordBreak: "break-word",
                        fontWeight: mine ? "500" : "400",
                      }}>{msg.message}</div>
                      <p style={{
                        fontSize: "10px", color: C.muted, marginTop: "3px",
                        textAlign: mine ? "right" : "left",
                        paddingLeft: mine ? 0 : "4px", paddingRight: mine ? "4px" : 0,
                      }}>
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {mine && (
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: C.lavenderDark, fontWeight: "700", fontSize: "11px",
                        flexShrink: 0, marginBottom: "2px",
                      }}>{currentUser?.name?.charAt(0)?.toUpperCase()}</div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: "14px 20px", borderTop: `2px solid ${C.border}`,
              display: "flex", gap: "10px", alignItems: "center", background: C.white,
            }}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={`Message ${selectedUser.name}...`}
                style={{
                  flex: 1, padding: "12px 16px",
                  border: `2px solid ${C.border}`, borderRadius: "12px",
                  fontSize: "14px", outline: "none",
                  fontFamily: "Poppins, sans-serif",
                  background: `${C.lavender}22`, color: C.text,
                }}
              />
              <button onClick={sendMessage} disabled={!newMessage.trim()} style={{
                padding: "12px 22px",
                background: newMessage.trim()
                  ? `linear-gradient(135deg, ${C.lavender}, ${C.pink})`
                  : C.border,
                color: newMessage.trim() ? C.lavenderDark : C.muted,
                border: "none", borderRadius: "12px",
                fontWeight: "700", fontSize: "14px",
                cursor: newMessage.trim() ? "pointer" : "not-allowed",
                fontFamily: "Poppins, sans-serif", transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}>Send →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
