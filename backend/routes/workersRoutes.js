const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getAllFabricsForWorker, updateAssignmentStatus } = require('../controllers/fabric/workerController');
const router = express.Router();


// /api/workers/
router.put('/update-status/:assignmentId', authMiddleware, updateAssignmentStatus);

router.get('/fabrics', authMiddleware, getAllFabricsForWorker);


module.exports = router;
