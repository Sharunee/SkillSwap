import React from "react";

function Sessions() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "80px 40px",
        border: "2px solid #EDE9FE",
        boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div style={{ fontSize: "56px", marginBottom: "20px" }}>📅</div>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "#7C3AED",
          marginBottom: "8px",
        }}
      >
        Sessions Coming Soon!
      </h2>
      <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
        Booking system is being built. Stay tuned!
      </p>
    </div>
  );
}

export default Sessions;
