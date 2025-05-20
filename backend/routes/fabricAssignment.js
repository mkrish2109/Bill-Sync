// routes/fabricAssignment.js (backend)
const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAssignmentHistory } = require('../controllers/fabric/commonController');
const { updateFabric } = require('../controllers/fabric/buyerController');

const router = express.Router();

// Assign worker to fabric
// router.post('/assign-worker', authMiddleware,fabricAssignment);


module.exports = router;
