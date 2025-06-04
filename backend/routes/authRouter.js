const express = require('express');
const {
  register,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  checkSession
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/check-session', checkSession);

module.exports = router;
