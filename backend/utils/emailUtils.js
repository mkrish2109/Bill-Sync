const nodemailer = require("nodemailer");

const origin = "http://localhost:3000";  // Adjust this to your production URL

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
    from: '"Ecom Express" <ecomexpress@ethereal.email>',  // Adjust this to your email
    to,
    subject,
    html,
  });

  // console.log("Message sent: ", response.messageId);
};

// Function to send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const html = `
        <p>Click this link to verify your email: </p>
        <a href=${origin}/verify-email?token=${token}&email=${email}>Verify Email</a>
    `;
    await sendMail({ to: email, subject: "Verify Email", html });
  } catch (error) {
    console.log("Failed to send verification email. Error: ", error.message);
  }
};

// Function to send reset password email
const sendResetPasswordEmail = async (email, token) => {
  try {
    const html = `
        <p>Click this link to reset your password: </p>
        <a href=${origin}/reset-password?token=${token}&email=${email}>Reset Password</a>
    `;
    await sendMail({ to: email, subject: "Reset Password", html });
  } catch (error) {
    console.log("Failed to send reset password email. Error: ", error.message);
  }
};

module.exports = { sendMail, sendVerificationEmail, sendResetPasswordEmail };
