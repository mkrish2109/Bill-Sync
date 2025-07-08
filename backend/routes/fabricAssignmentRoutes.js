const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { updateAssignmentStatus } = require('../controllers/fabricAssignment');

const router = express.Router();

// Assign worker to fabric
// router.post('/assign-worker', authMiddleware,fabricAssignment);

router.put('/update-status/:assignmentId', authMiddleware, updateAssignmentStatus);


module.exports = router;
