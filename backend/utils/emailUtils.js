const nodemailer = require("nodemailer");

const origin = "http://localhost:3000";  // Adjust this to your production URL
const brandName = "Bill Sync";
const supportEmail = "support@billsync.com";
const logoUrl = "https://billsync.com/logo.png"; // Optional: update to your real logo URL
const primaryColor = "#7A4F2A"; // Use your brand's primary color

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "makenna25@ethereal.email",
    pass: "p4Q4rBkChW5ZCCBMKw",
  },
});

// Function to send email
const sendMail = async ({ to, subject, html }) => {
  const response = await transporter.sendMail({
    from: `"${brandName}" <${supportEmail}>`,
    to,
    subject,
    html,
  });

  // console.log("Message sent: ", response.messageId);
};

// Helper to wrap content in a branded template
const wrapTemplate = (content, title = brandName) => `
  <div style="background:#f9fafb;padding:32px 0;min-height:100vh;font-family:sans-serif;">
    <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.07);padding:32px 24px 24px 24px;">
      <div style="text-align:center;margin-bottom:24px;">
        <img src='${logoUrl}' alt='${brandName} Logo' style='height:48px;margin-bottom:8px;' onerror="this.style.display='none'"/>
        <h2 style="margin:0;font-size:1.5rem;color:${primaryColor};font-weight:700;">${title}</h2>
      </div>
      <div style="font-size:1rem;color:#374151;line-height:1.6;">
        ${content}
      </div>
      <div style="margin-top:32px;text-align:center;font-size:0.95rem;color:#6B7280;">
        &mdash; The ${brandName} Team<br/>
        <a href="mailto:${supportEmail}" style="color:${primaryColor};text-decoration:none;">${supportEmail}</a>
      </div>
    </div>
  </div>
`;

// Function to send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const verifyUrl = `${origin}/verify-email?token=${token}&email=${email}`;
    const html = wrapTemplate(`
      <p style="margin-bottom:24px;">Thank you for signing up! Please verify your email address to activate your account.</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 28px;background:${primaryColor};color:#fff;border-radius:6px;text-decoration:none;font-weight:600;font-size:1rem;margin-bottom:12px;">Verify Email</a>
      <p style="margin:16px 0 0 0;font-size:0.97rem;color:#6B7280;">If the button above doesn't work, copy and paste this link into your browser:</p>
      <div style="word-break:break-all;font-size:0.97rem;margin-top:4px;"><a href="${verifyUrl}" style="color:${primaryColor};">${verifyUrl}</a></div>
    `, "Verify Your Email");
    await sendMail({ to: email, subject: "Verify Your Email Address", html });
  } catch (error) {
    console.log("Failed to send verification email. Error: ", error.message);
  }
};

// Function to send reset password email
const sendResetPasswordEmail = async (email, token) => {
  try {
    const resetUrl = `${origin}/reset-password?token=${token}&email=${email}`;
    const html = wrapTemplate(`
      <p style="margin-bottom:24px;">We received a request to reset your password. Click the button below to set a new password.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;background:${primaryColor};color:#fff;border-radius:6px;text-decoration:none;font-weight:600;font-size:1rem;margin-bottom:12px;">Reset Password</a>
      <p style="margin:16px 0 0 0;font-size:0.97rem;color:#6B7280;">If you did not request a password reset, you can safely ignore this email.<br/>If the button above doesn't work, copy and paste this link into your browser:</p>
      <div style="word-break:break-all;font-size:0.97rem;margin-top:4px;"><a href="${resetUrl}" style="color:${primaryColor};">${resetUrl}</a></div>
    `, "Reset Your Password");
    await sendMail({ to: email, subject: "Reset Your Password", html });
  } catch (error) {
    console.log("Failed to send reset password email. Error: ", error.message);
  }
};

module.exports = { sendMail, sendVerificationEmail, sendResetPasswordEmail };
