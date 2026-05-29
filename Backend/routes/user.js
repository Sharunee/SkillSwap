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
// skillsOffered / skillsWanted are arrays of { skill, mode, location }
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, bio, location, skillsOffered, skillsWanted } = req.body;

    // Sanitise skill objects: ensure required fields exist
    const sanitiseSkills = (arr) =>
      (arr || [])
        .map((s) => ({
          skill: (s.skill || "").trim(),
          mode: ["Online", "In-Person", "Both"].includes(s.mode)
            ? s.mode
            : "Online",
          location: s.mode === "Online" ? "" : (s.location || "").trim(),
        }))
        .filter((s) => s.skill.length > 0);

    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name,
        bio,
        location,
        skillsOffered: sanitiseSkills(skillsOffered),
        skillsWanted: sanitiseSkills(skillsWanted),
      },
      { new: true },
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
