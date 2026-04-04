const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const protect = require("../middleware/authMiddleware");

// Get chat history between 2 users
router.get("/:receiverId", protect, async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.receiverId;

    // Create a unique room ID
    const roomId = [senderId, receiverId].sort().join("_");

    const messages = await Message.find({ roomId })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
