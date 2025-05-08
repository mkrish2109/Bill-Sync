// routes/worker.js (backend)
const express = require('express');
const FabricAssignment = require('../models/FabricAssignment');
const auth = require('../middleware/auth');
const router = express.Router();

// Update fabric assignment status
router.put('/update-status/:assignmentId', auth.authMiddleware, async (req, res) => {
  const { status } = req.body;
  const { assignmentId } = req.params;

  try {
    const assignment = await FabricAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Ensure worker is the one updating the status
    if (assignment.workerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this assignment' });
    }

    assignment.status = status;
    await assignment.save();
    res.json({ message: 'Status updated successfully', assignment });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
