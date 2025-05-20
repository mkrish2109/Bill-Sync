
const Fabric = require("../../models/Fabric");

// Shared logic that can be used by both buyers and workers
const getFabricById = async (req, res) => {
  try {
    const fabric = await Fabric.findById(req.params.id)
      .populate('buyerId', 'name contact company')
      .populate({
        path: 'assignments',
        populate: [
          {
            path: 'workerId',
            select: 'name contact'
          },
          // Only populate changedBy if it exists in statusHistory
          {
            path: 'statusHistory.changedBy',
            select: 'name role',
            model: 'User'
          }
        ]
      });

    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: 'Fabric not found'
      });
    }

    const fabricObj = fabric.toObject();
    
    if (fabric.assignments && fabric.assignments.length > 0) {
       fabricObj.workers = fabric.assignments.map(assignment => ({
        ...(assignment.workerId?.toObject() || {}),
        status: assignment.status,
        assignedAt: assignment.createdAt,
        assignmentId: assignment._id,
        // Include status history if needed
        history: assignment.statusHistory || []
      }));

      if (req.user.role === 'buyer') {
        fabricObj.assignmentId = fabric.assignments[0]._id;
        fabricObj.assignmentStatus = fabric.assignments[0].status;
        fabricObj.statusHistory = fabric.assignments[0].statusHistory || [];
      }
      if (req.user.role === 'worker') {
        const userAssignment = fabric.assignments.find(a => 
          a.workerId?._id.toString() === req.user.userId
        );
        
        if (userAssignment) {
          fabricObj.assignmentStatus = userAssignment.status;
          fabricObj.assignmentId = userAssignment._id;
          fabricObj.assignedAt = userAssignment.createdAt;
          fabricObj.statusHistory = userAssignment.statusHistory || [];
        }
      }
    }

    res.status(200).json({
      success: true,
      data: fabricObj
    });
  } catch (error) {
    console.error('Error fetching fabric:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


const getFabricWithHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const fabric = await Fabric.findById(id)
      .populate([
        {
          path: 'buyerId',
          select: 'name contact company'
        },
        {
          path: 'assignments',
          populate: [
            {
              path: 'workerId',
              select: 'name contact'
            },
            {
              path: 'statusHistory.changedBy',
              select: 'name role email fname lname',
              model: 'User'
            }
          ]
        },
        {
          path: 'changeHistory.changedBy',
          select: 'name role email fname lname'
        }
      ]);

    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: 'Fabric not found'
      });
    }

    const fabricObj = fabric.toObject();
    
    // Process assignments data
    if (fabric.assignments && fabric.assignments.length > 0) {
      fabricObj.workers = fabric.assignments.map(assignment => ({
        ...(assignment.workerId?.toObject() || {}),
        status: assignment.status,
        assignedAt: assignment.createdAt,
        assignmentId: assignment._id
      }));

      // For buyers and workers, include relevant assignment info
      const relevantAssignment = req.user.role === 'worker' 
        ? fabric.assignments.find(a => a.workerId?._id.toString() === req.user.userId)
        : fabric.assignments[0];

      if (relevantAssignment) {
        fabricObj.assignmentId = relevantAssignment._id;
        fabricObj.assignmentStatus = relevantAssignment.status;
        fabricObj.assignedAt = relevantAssignment.createdAt;
        fabricObj.statusHistory = (relevantAssignment.statusHistory || [])
          .map(item => ({
            ...item.toObject(),
            changedBy: item.changedBy || { name: 'System', role: 'system' }
          }))
          .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
      }
    }

    res.status(200).json({
      success: true,
      data: fabricObj
    });
  } catch (error) {
    console.error('Error fetching fabric:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getFabricById,
  getFabricWithHistory

};