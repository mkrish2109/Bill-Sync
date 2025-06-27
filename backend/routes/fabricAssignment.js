const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getAssignmentHistory } = require('../controllers/fabric/commonController');
const { updateFabric } = require('../controllers/fabric/buyerController');
const { updateAssignmentStatus } = require('../controllers/fabricAssignment');

const router = express.Router();

// Assign worker to fabric
// router.post('/assign-worker', authMiddleware,fabricAssignment);

router.put('/update-status/:assignmentId', authMiddleware, updateAssignmentStatus);


module.exports = router;
