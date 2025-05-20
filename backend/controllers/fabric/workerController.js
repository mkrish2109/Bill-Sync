// controllers/fabric/workerController.js
const mongoose = require('mongoose');
const FabricAssignment = require("../../models/FabricAssignment");
const commonController = require("./commonController");
// Get all fabrics assigned to a worker
const getAllFabricsForWorker = async (req, res) => {
  try {
    const { userId } = req.user;

    const assignments = await FabricAssignment.find({ workerId: userId })
      .populate({
        path: 'fabricId',
        populate: {
          path: 'buyerId',
          select: 'name contact company'
        }
      })
      .populate({
        path: 'workerId',
        select: 'name contact'
      });

    const workerFabrics = assignments.map(assignment => {
      const fabric = assignment.fabricId;
      return {
        ...fabric.toObject(),
        assignmentStatus: assignment.status,
        assignedAt: assignment.createdAt,
        assignmentId: assignment._id,
        worker: assignment.workerId
      };
    });

    res.status(200).json({
      success: true,
      count: workerFabrics.length,
      data: workerFabrics
    });
  } catch (error) {
    console.error('Error fetching fabrics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update assignment status (worker only)
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
    }

    // Create and push history entry
    const historyEntry = {
      previousStatus: assignment.status,
      newStatus: status,
      changedBy: userId,
      changedAt: new Date()
    };

    assignment.status = status;
    assignment.statusHistory = assignment.statusHistory || [];
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
  getAllFabricsForWorker,
  updateAssignmentStatus,
  getFabricById: commonController.getFabricById
};