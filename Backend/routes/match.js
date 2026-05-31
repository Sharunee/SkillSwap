const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

function locationsCompatible(skillA, skillB) {
  const modeA = skillA.mode || "Online";
  const modeB = skillB.mode || "Online";

  // Both can do Online → compatible (no location needed)
  const aOnline = modeA === "Online" || modeA === "Both";
  const bOnline = modeB === "Online" || modeB === "Both";
  if (aOnline && bOnline) return true;

  // Both can do In-Person → compatible only if locations match or either is unset
  const aInPerson = modeA === "In-Person" || modeA === "Both";
  const bInPerson = modeB === "In-Person" || modeB === "Both";
  if (aInPerson && bInPerson) {
    const locA = (skillA.location || "").trim().toLowerCase();
    const locB = (skillB.location || "").trim().toLowerCase();
    // If either has no location set, allow the match (user can clarify later)
    if (!locA || !locB) return true;
    return locA === locB;
  }

  // One side is Online-only, the other is In-Person-only → incompatible
  return false;
}

router.get("/", protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });

    // Safely normalise arrays — old documents may not have these fields
    const myWanted = Array.isArray(currentUser.skillsWanted)
      ? currentUser.skillsWanted
      : [];
    const myOffered = Array.isArray(currentUser.skillsOffered)
      ? currentUser.skillsOffered
      : [];

    const allUsers = await User.find({ _id: { $ne: req.user.userId } });

    const matches = allUsers.map((otherUser) => {
      // Safely normalise the other user's arrays too
      const theirOffered = Array.isArray(otherUser.skillsOffered)
        ? otherUser.skillsOffered
        : [];
      const theirWanted = Array.isArray(otherUser.skillsWanted)
        ? otherUser.skillsWanted
        : [];

      // ── Skills I can learn from them ─────────────────────
      const skillsICanLearn = [];
      let scoreLearn = 0;

      for (const wanted of myWanted) {
        if (!wanted || !wanted.skill) continue; // skip malformed entries
        for (const offered of theirOffered) {
          if (!offered || !offered.skill) continue;
          if (
            wanted.skill.trim().toLowerCase() ===
            offered.skill.trim().toLowerCase()
          ) {
            const locMatch = locationsCompatible(wanted, offered);
            if (!locMatch) continue; // incompatible mode / location
            skillsICanLearn.push({
              skill: offered.skill,
              mode: offered.mode || "Online",
              location: offered.location || "",
              locationMatch: true,
            });
            scoreLearn += 2;
          }
        }
      }

      // ── Skills I can teach them ──────────────────────────
      const skillsICanTeach = [];
      let scoreTeach = 0;

      for (const offered of myOffered) {
        if (!offered || !offered.skill) continue;
        for (const wanted of theirWanted) {
          if (!wanted || !wanted.skill) continue;
          if (
            offered.skill.trim().toLowerCase() ===
            wanted.skill.trim().toLowerCase()
          ) {
            const locMatch = locationsCompatible(offered, wanted);
            if (!locMatch) continue;
            skillsICanTeach.push({
              skill: offered.skill,
              mode: offered.mode || "Online",
              location: offered.location || "",
              locationMatch: true,
            });
            scoreTeach += 2;
          }
        }
      }

      // ── Match percentage ─────────────────────────────────
      const totalMatched = skillsICanLearn.length + skillsICanTeach.length;
      const totalPossible = myWanted.length + myOffered.length;

      const matchPercent =
        totalPossible > 0
          ? Math.min(Math.round((totalMatched / totalPossible) * 100), 100)
          : 0;

      // Small bonus if there are any location-compatible matches
      const locationBonus = scoreLearn + scoreTeach - totalMatched > 0 ? 5 : 0;
      const finalPercent = Math.min(matchPercent + locationBonus, 100);

      return {
        user: {
          _id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          bio: otherUser.bio || "",
          location: otherUser.location || "",
          skillsOffered: theirOffered,
          skillsWanted: theirWanted,
        },
        matchPercent: finalPercent,
        skillsICanTeach,
        skillsICanLearn,
      };
    });

    // Only return users who share at least one skill with the current user
    const sorted = matches
      .filter(
        (m) => m.skillsICanLearn.length > 0 || m.skillsICanTeach.length > 0,
      )
      .sort((a, b) => b.matchPercent - a.matchPercent);

    res.json(sorted);
  } catch (err) {
    console.error("Match route error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
