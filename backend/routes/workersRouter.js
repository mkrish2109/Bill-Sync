// routes/worker.js (backend)
const express = require('express');
const FabricAssignment = require('../models/FabricAssignment');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getallWorkers, getReceivedRequests } = require('../controllers/workerController');
const { getAllFabricsForWorker, updateAssignmentStatus } = require('../controllers/fabric/workerController');
const router = express.Router();


// /api/workers/
// Update fabric assignment status
router.put('/update-status/:assignmentId', authMiddleware, updateAssignmentStatus);

router.get('/fabrics', authMiddleware, getAllFabricsForWorker);

router.get("/all",authMiddleware, getallWorkers);


module.exports = router;
