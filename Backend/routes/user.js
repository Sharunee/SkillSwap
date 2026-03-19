const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

// GET my profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE profile & skills
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, bio, location, skillsOffered, skillsWanted } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      { name, bio, location, skillsOffered, skillsWanted },
      { new: true },
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
