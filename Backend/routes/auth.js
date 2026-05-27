const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOtpEmail = require("../utils/sendOtpEmail");

// ── Helper: generate 6-digit OTP ──────────────────────
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ─────────────────────────────────────────────────────
// POST /api/auth/register
// Creates unverified user, sends OTP email
// ─────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    // If user already exists but is NOT verified → allow re-register (resend OTP)
    const existing = await User.findOne({ email });
    if (existing && existing.isVerified)
      return res
        .status(400)
        .json({ message: "Email already registered. Please login." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    if (existing && !existing.isVerified) {
      // Update existing unverified record
      existing.name = name;
      existing.password = hashedPassword;
      existing.otp = otp;
      existing.otpExpiry = otpExpiry;
      await existing.save();
    } else {
      await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
      });
    }

    // Send OTP email
    await sendOtpEmail(email, name, otp);

    // Return a short-lived temp token so the verify-otp page knows which email to verify
    const tempToken = jwt.sign(
      { email, purpose: "otp-verify" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.status(201).json({
      message: "OTP sent to your email. Please verify.",
      tempToken,
      email,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Verifies OTP and returns full JWT
// ─────────────────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.isVerified)
      return res
        .status(400)
        .json({ message: "Email already verified. Please login." });

    if (!user.otp || !user.otpExpiry)
      return res
        .status(400)
        .json({ message: "No OTP found. Please register again." });

    if (new Date() > user.otpExpiry)
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });

    if (user.otp !== otp.trim())
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });

    // Mark verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Issue full JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "✅ Email verified successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────────────────
// POST /api/auth/resend-otp
// Resends a fresh OTP to the email
// ─────────────────────────────────────────────────────
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.isVerified)
      return res.status(400).json({ message: "Email already verified." });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOtpEmail(email, user.name, otp);

    res.json({ message: "New OTP sent to your email." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────────────────
// POST /api/auth/login
// Blocks unverified users
// ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    if (!user.isVerified)
      return res.status(403).json({
        message: "Email not verified. Please verify your email first.",
        email,
        notVerified: true,
      });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
