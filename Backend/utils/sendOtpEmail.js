const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOtpEmail = async (toEmail, toName, otp) => {
  const mailOptions = {
    from: `"SkillSwap 🔁" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Your SkillSwap Verification Code",
    html: `
      <div style="font-family:Poppins,sans-serif;max-width:480px;margin:0 auto;background:#f0f6f9;border-radius:20px;overflow:hidden;">
        <div style="background:#809bce;padding:32px;text-align:center;">
          <h1 style="color:#ffffff;font-size:24px;margin:0;">SkillSwap 🔁</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Email Verification</p>
        </div>
        <div style="padding:32px;background:#ffffff;">
          <p style="color:#2e3a5c;font-size:16px;font-weight:600;">Hi ${toName} 👋</p>
          <p style="color:#6B7280;font-size:14px;line-height:1.7;">
            Thanks for signing up! Use the verification code below to confirm your email address.
            This code expires in <strong>10 minutes</strong>.
          </p>
          <div style="background:#f0f6f9;border:2px solid #b8e0d2;border-radius:16px;padding:28px;text-align:center;margin:24px 0;">
            <p style="color:#9CA3AF;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Verification Code</p>
            <p style="color:#809bce;font-size:42px;font-weight:800;letter-spacing:10px;margin:0;">${otp}</p>
          </div>
          <p style="color:#9CA3AF;font-size:13px;">
            If you didn't create a SkillSwap account, you can safely ignore this email.
          </p>
        </div>
        <div style="padding:20px 32px;background:#f0f6f9;text-align:center;">
          <p style="color:#9CA3AF;font-size:12px;margin:0;">© ${new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
