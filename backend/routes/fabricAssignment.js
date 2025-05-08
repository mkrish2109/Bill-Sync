// routes/fabricAssignment.js (backend)
const express = require('express');
const FabricAssignment = require('../models/FabricAssignment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { fabricAssignment } = require('../controllers/fabricAssignment');

const router = express.Router();

// Assign worker to fabric
router.post('/assign-worker', auth.authMiddleware,fabricAssignment);

module.exports = router;
