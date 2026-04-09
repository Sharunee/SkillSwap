const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const matchRoutes = require("./routes/match");
const chatRoutes = require("./routes/chat");
const Message = require("./models/Message");
const sessionRoutes = require("./routes/session");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Join a chat room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Send message
  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, message } = data;
      const roomId = [senderId, receiverId].sort().join("_");

      // Save to database
      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        message,
        roomId,
      });
      await newMessage.save();

      // Send to room
      io.to(roomId).emit("receive_message", {
        senderId,
        receiverId,
        message,
        roomId,
        createdAt: new Date(),
      });
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("🚀 Server running on port 5000"));
