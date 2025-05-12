// routes/fabricAssignment.js (backend)
const express = require('express');
const FabricAssignment = require('../models/FabricAssignment');
const User = require('../models/User');
const { fabricAssignment } = require('../controllers/fabricAssignment');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Assign worker to fabric
router.post('/assign-worker', authMiddleware,fabricAssignment);

module.exports = router;
