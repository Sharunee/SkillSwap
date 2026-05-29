const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    mode: {
      type: String,
      enum: ["Online", "In-Person", "Both"],
      default: "Online",
    },
    location: { type: String, default: "" }, // relevant only for In-Person / Both
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    skillsOffered: { type: [skillSchema], default: [] },
    skillsWanted: { type: [skillSchema], default: [] },
    points: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    // ── OTP Email Verification ──────────────────────
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
