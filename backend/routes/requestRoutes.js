// routes/requestRoutes.js

const express = require('express');
const router = express.Router();
const availableUsersController = require('../controllers/availableUsersController');
const requestController = require('../controllers/requestController');
const {authMiddleware} = require('../middleware/authMiddleware');

// Get available users
router.get('/available/workers', authMiddleware, availableUsersController.getAvailableWorkers);

// Request management
router.post('/', authMiddleware, requestController.sendRequest);
router.put('/:requestId/accept', authMiddleware, requestController.acceptRequest);
router.put('/:requestId/reject', authMiddleware, requestController.rejectRequest);
router.get('/', authMiddleware, requestController.getUserRequests);
router.get('/connections', authMiddleware, requestController.getConnectedUsers);

module.exports = router;