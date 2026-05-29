const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

/**
 * Checks whether two skill entries are location-compatible.
 * Returns true if either side is Online-only (no physical presence needed),
 * or if both share a physical location (case-insensitive trim match).
 */
function locationsCompatible(skillA, skillB) {
  const modeA = skillA.mode;
  const modeB = skillB.mode;

  // If either side is Online-only, they are always compatible (virtual meet)
  if (modeA === "Online" || modeB === "Online") return true;

  // Both sides require a physical presence (In-Person or Both)
  // Require that their listed locations match
  const locA = (skillA.location || "").trim().toLowerCase();
  const locB = (skillB.location || "").trim().toLowerCase();

  return locA.length > 0 && locB.length > 0 && locA === locB;
}

router.get("/", protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const allUsers = await User.find({ _id: { $ne: req.user.userId } });

    const matches = allUsers.map((otherUser) => {
      // ── Skills the other user can TEACH me ─────────────────────────────
      // currentUser.skillsWanted  vs  otherUser.skillsOffered
      const skillsICanLearn = []; // { skill, mode, location, locationMatch }
      let scoreLearn = 0;

      for (const wanted of currentUser.skillsWanted) {
        for (const offered of otherUser.skillsOffered) {
          if (
            wanted.skill.trim().toLowerCase() ===
            offered.skill.trim().toLowerCase()
          ) {
            const locMatch = locationsCompatible(wanted, offered);
            skillsICanLearn.push({
              skill: offered.skill,
              mode: offered.mode,
              location: offered.location || "",
              locationMatch: locMatch,
            });
            scoreLearn += locMatch ? 80 : 40;
            break; // one match per wanted skill is enough
          }
        }
      }

      // ── Skills I can TEACH the other user ──────────────────────────────
      // currentUser.skillsOffered  vs  otherUser.skillsWanted
      const skillsICanTeach = []; // { skill, mode, location, locationMatch }
      let scoreTeach = 0;

      for (const offered of currentUser.skillsOffered) {
        for (const wanted of otherUser.skillsWanted) {
          if (
            offered.skill.trim().toLowerCase() ===
            wanted.skill.trim().toLowerCase()
          ) {
            const locMatch = locationsCompatible(offered, wanted);
            skillsICanTeach.push({
              skill: offered.skill,
              mode: offered.mode,
              location: offered.location || "",
              locationMatch: locMatch,
            });
            scoreTeach += locMatch ? 80 : 40;
            break;
          }
        }
      }

      const totalScore = scoreLearn + scoreTeach;
      const matchPercent = Math.min(totalScore, 100);

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

    // Only users where at least one skill matches (regardless of location)
    const sorted = matches
      .filter((m) => m.matchPercent > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
