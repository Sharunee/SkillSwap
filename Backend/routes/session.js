const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const protect = require("../middleware/authMiddleware");

// Book a session
router.post("/book", protect, async (req, res) => {
  try {
    const { receiverId, skill, date, time, message } = req.body;

    if (!receiverId || !skill || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const session = new Session({
      requester: req.user.userId,
      receiver: receiverId,
      skill,
      date,
      time,
      message: message || "",
    });

    await session.save();
    res.status(201).json({ message: "✅ Session booked!", session });
  } catch (err) {
    console.log("Session booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get my sessions
router.get("/", protect, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ requester: req.user.userId }, { receiver: req.user.userId }],
    })
      .populate("requester", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (err) {
    console.log("Get sessions error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Accept or Reject session
router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )
      .populate("requester", "name email")
      .populate("receiver", "name email");

    res.json({ message: `Session ${status}!`, session });
  } catch (err) {
    console.log("Update session error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
