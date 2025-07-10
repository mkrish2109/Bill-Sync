const express = require('express');
const {
  register,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  verifyAuth,
  refreshToken,
  getTokenExpiry,
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-auth', verifyAuth);
router.get('/token-expiry', getTokenExpiry);

module.exports = router;
