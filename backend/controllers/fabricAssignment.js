const mongoose = require('mongoose');
const FabricAssignment = require('../models/FabricAssignment');

const fabricAssignment = async (req, res) => {
  const { fabricId, workerId } = req.body;

  // Ensure buyer is assigning the worker
  const buyer = await User.findById(req.user.id);
  if (buyer.role !== 'buyer') {
    return res.status(403).json({ message: 'Only buyers can assign workers' });
  }

  try {
    // Check if worker is valid
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(400).json({ message: 'Invalid worker selected' });
    }

    // Check if there's already an assignment for this fabric
    const existingAssignment = await FabricAssignment.findOne({ fabricId });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Fabric is already assigned to a worker' });
    }

    // Create fabric assignment
    const newAssignment = new FabricAssignment({
      fabricId,
      buyerId: buyer._id,
      workerId: worker._id,
    });

    await newAssignment.save();
    res.json({ message: 'Worker assigned successfully', assignment: newAssignment });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
} 

const updateAssignmentStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    // Check if assignmentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid assignment ID format'
      });
    }

    // Validate status
    const validStatuses = ['assigned', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    // Find assignment
    const assignment = await FabricAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }if(assignment.status === status) {
      return res.status(400).json({
        success: false,
        error: 'Assignment is already in this status'
      });
    }
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    // Create history entry
    const historyEntry = {
      previousStatus: assignment.status,
      newStatus: status,
      changedAt: new Date(),
      changedBy: userId
    };

    // Update assignment status and history
    assignment.status = status;
    assignment.statusHistory.push(historyEntry);
    assignment.updatedAt = new Date();

    await assignment.save();

    // Populate history for response
    await assignment.populate({
      path: 'statusHistory.changedBy',
      select: 'name role',
      model: 'User'
    });

    res.status(200).json({
      success: true,
      data: assignment
    });

  } catch (error) {
    console.error('Error updating assignment status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  fabricAssignment,
  updateAssignmentStatus
}