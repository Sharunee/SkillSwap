const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
  try {
    // Get current user
    const currentUser = await User.findById(req.user.userId);

    // Get all other users
    const allUsers = await User.find({ _id: { $ne: req.user.userId } });

    // Calculate match score for each user
    const matches = allUsers.map((otherUser) => {
      let score = 0;

      // What current user offers vs what other user wants
      const skillsICanTeach = currentUser.skillsOffered.filter((skill) =>
        otherUser.skillsWanted.includes(skill),
      );

      // What current user wants vs what other user offers
      const skillsICanLearn = currentUser.skillsWanted.filter((skill) =>
        otherUser.skillsOffered.includes(skill),
      );

      // Calculate score
      score += skillsICanTeach.length * 50;
      score += skillsICanLearn.length * 50;

      // Cap at 100
      const matchPercent = Math.min(score, 100);

      return {
        user: {
          _id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          bio: otherUser.bio,
          location: otherUser.location,
          skillsOffered: otherUser.skillsOffered,
          skillsWanted: otherUser.skillsWanted,
        },
        matchPercent,
        skillsICanTeach,
        skillsICanLearn,
      };
    });

    // Filter users with at least some match and sort by score
    const sorted = matches
      .filter((m) => m.matchPercent > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
