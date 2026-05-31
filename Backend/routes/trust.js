const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");
const User = require("../models/User");
const Session = require("../models/session");
const protect = require("../middleware/authMiddleware");

// Submit a rating
router.post("/rate", protect, async (req, res) => {
  try {
    const { sessionId, ratedUserId, rating, review } = req.body;

    // Check if already rated
    const existing = await Rating.findOne({
      rater: req.user.userId,
      session: sessionId,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You already rated this session" });
    }

    // Save rating
    const newRating = new Rating({
      rater: req.user.userId,
      rated: ratedUserId,
      session: sessionId,
      rating,
      review,
    });
    await newRating.save();

    // Update user average rating
    const allRatings = await Rating.find({ rated: ratedUserId });
    const avgRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await User.findByIdAndUpdate(ratedUserId, {
      rating: Math.round(avgRating * 10) / 10,
      totalRatings: allRatings.length,
      $inc: { points: 10 },
    });

    // Add points to rater too
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { points: 5 },
    });

    res
      .status(201)
      .json({ message: "✅ Rating submitted!", rating: newRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get ratings for a user
router.get("/ratings/:userId", protect, async (req, res) => {
  try {
    const ratings = await Rating.find({ rated: req.params.userId })
      .populate("rater", "name")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Confirm session completed
router.put("/confirm/:sessionId", protect, async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.sessionId,
      { status: "completed" },
      { new: true },
    );

    // Add points for completing session
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { points: 20 },
    });

    res.json({ message: "✅ Session confirmed complete!", session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
