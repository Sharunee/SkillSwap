import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const C = {
  primary: "#809bce",
  secondary: "#95b8d1",
  accent: "#b8e0d2",
  light: "#d6eadf",
  soft: "#eac4d5",
  dark: "#2e3a5c",
  bg: "#f0f6f9",
  white: "#ffffff",
};

function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("otpEmail");
    if (!storedEmail) {
      window.location.href = "/register";
      return;
    }
    setEmail(storedEmail);
    startCountdown();
  }, []);

  const startCountdown = () => {
    setCanResend(false);
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // one digit per box
    setOtp(newOtp);
    // Auto-focus next
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setMessage("Please enter all 6 digits.");
      setMsgType("error");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp: otpString },
      );
      // Store full JWT and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.removeItem("otpTempToken");
      localStorage.removeItem("otpEmail");
      setMessage("✅ Email verified! Redirecting to dashboard...");
      setMsgType("success");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Verification failed. Try again.",
      );
      setMsgType("error");
      // Shake effect — clear OTP on wrong code
      if (err.response?.status === 400) setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    setMessage("");
    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      setMessage("📧 New OTP sent to your email!");
      setMsgType("success");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      startCountdown();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to resend OTP.");
      setMsgType("error");
    }
    setResending(false);
  };

  const maskedEmail = email
    ? email.replace(
        /(.{2})(.*)(@.*)/,
        (_, a, b, c) => a + "*".repeat(Math.min(b.length, 5)) + c,
      )
    : "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Blobs */}
      <div
        style={{
          position: "fixed",
          top: "-80px",
          right: "-80px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: C.primary,
          opacity: 0.12,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-60px",
          left: "-60px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: C.soft,
          opacity: 0.18,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          background: C.white,
          borderRadius: "24px",
          padding: "40px",
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 8px 32px rgba(128,155,206,0.18)",
          border: `1px solid ${C.light}`,
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: C.bg,
            border: `2px solid ${C.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            margin: "0 auto 20px",
          }}
        >
          📧
        </div>

        <h2
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: C.dark,
            marginBottom: "8px",
          }}
        >
          Verify Your Email
        </h2>
        <p
          style={{
            color: "#9CA3AF",
            fontSize: "13px",
            lineHeight: 1.7,
            marginBottom: "28px",
          }}
        >
          We sent a 6-digit code to
          <br />
          <strong style={{ color: C.primary }}>{maskedEmail}</strong>
        </p>

        {/* OTP Input Boxes */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              style={{
                width: "48px",
                height: "56px",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: "700",
                border: `2px solid ${digit ? C.primary : C.light}`,
                borderRadius: "12px",
                outline: "none",
                background: digit ? "#eef2fb" : C.bg,
                color: C.dark,
                fontFamily: "Poppins, sans-serif",
                transition: "all 0.15s",
              }}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? C.secondary : C.primary,
            color: C.white,
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "Poppins, sans-serif",
            boxShadow: "0 4px 14px rgba(128,155,206,0.35)",
            marginBottom: "16px",
          }}
        >
          {loading ? "Verifying..." : "✅ Verify Email"}
        </button>

        {/* Message */}
        {message && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "16px",
              background: msgType === "success" ? C.light : "#fde8e8",
              border: `1px solid ${msgType === "success" ? C.accent : "#fca5a5"}`,
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "500",
              color: msgType === "success" ? "#2a6b3a" : "#b91c1c",
            }}
          >
            {message}
          </div>
        )}

        {/* Resend */}
        <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
          Didn't receive the code?{" "}
          {canResend ? (
            <span
              onClick={!resending ? handleResend : undefined}
              style={{
                color: C.primary,
                fontWeight: "600",
                cursor: resending ? "not-allowed" : "pointer",
              }}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </span>
          ) : (
            <span style={{ color: C.secondary, fontWeight: "600" }}>
              Resend in {countdown}s
            </span>
          )}
        </p>

        {/* Back link */}
        <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "16px" }}>
          Wrong email?{" "}
          <span
            onClick={() => (window.location.href = "/register")}
            style={{ color: C.primary, fontWeight: "600", cursor: "pointer" }}
          >
            Go back
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
