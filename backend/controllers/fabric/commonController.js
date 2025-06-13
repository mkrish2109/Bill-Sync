const Fabric = require("../../models/Fabric");

// Shared logic that can be used by both buyers and workers
const getFabricById = async (req, res) => {
  try {
    const fabric = await Fabric.findById(req.params.id)
      .populate("buyerId", "name contact company")
      .populate({
        path: "assignments",
        populate: [
          {
            path: "workerId",
            select: "name contact",
          },
          {
            path: "statusHistory.changedBy",
            select: "name role",
            model: "User",
          },
        ],
      });

    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: "Fabric not found",
      });
    }

    const fabricObj = fabric.toObject();

    // Remove assignments array to avoid duplication
    // delete fabricObj.assignments;

    if (fabric.assignments && fabric.assignments.length > 0) {
      // Create workers array with only necessary data
      fabricObj.worker = fabric.assignments.map((assignment) => ({
        id: assignment.workerId?._id,
        name: assignment.workerId?.name,
        contact: assignment.workerId?.contact,
      }));
      fabricObj.buyer = fabric.buyerId || {};
    }
    delete fabricObj.assignments?.[0]?.workerId;
    delete fabricObj.assignments?.[0]?.statusHistory;

    // Add role-specific data
    // if (req.user.role === 'buyer') {
    //   const firstAssignment = fabric.assignments[0];
    //   fabricObj.statusHistory = firstAssignment.statusHistory || [];
    // }

    // if (req.user.role === 'worker') {
    //   const userAssignment = fabric.assignments.find(a =>
    //     a.workerId?._id.toString() === req.user.userId
    //   );

    //   if (userAssignment) {
    //     fabricObj.assignmentStatus = userAssignment.status;
    //     fabricObj.assignmentId = userAssignment._id;
    //     fabricObj.assignedAt = userAssignment.createdAt;
    //     fabricObj.statusHistory = userAssignment.statusHistory || [];
    //   }
    // }

    res.status(200).json({
      success: true,
      data: fabricObj,
    });
  } catch (error) {
    console.error("Error fetching fabric:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getFabricWithHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const fabric = await Fabric.findById(id).populate([
      {
        path: "buyerId",
        select: "name contact company",
      },
      {
        path: "assignments",
        populate: [
          {
            path: "workerId",
            select: "name contact",
          },
          {
            path: "statusHistory.changedBy",
            select: "name role email fname lname",
            model: "User",
          },
        ],
      },
      {
        path: "changeHistory.changedBy",
        select: "name role email fname lname",
      },
    ]);

    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: "Fabric not found",
      });
    }

    const fabricObj = fabric.toObject();

    // Process assignments data
    if (fabric.assignments && fabric.assignments.length > 0) {
      fabricObj.workers = fabric.assignments.map((assignment) => ({
        ...(assignment.workerId?.toObject() || {}),
        status: assignment.status,
        assignedAt: assignment.createdAt,
        assignmentId: assignment._id,
      }));

      // For buyers and workers, include relevant assignment info
      let relevantAssignment;
      if (req.user.role === "worker") {
        relevantAssignment = fabric.assignments.find(
          (assignment) =>
            assignment.workerId?._id.toString() === req.user.userId
        );
      } else {
        relevantAssignment = fabric.assignments[0];
      }

      if (relevantAssignment) {
        fabricObj.assignmentStatus = relevantAssignment.status;
        fabricObj.assignedAt = relevantAssignment.createdAt;
        fabricObj.statusHistory = (relevantAssignment.statusHistory || [])
          .map((item) => ({
            ...item.toObject(),
            changedBy: item.changedBy || { name: "System", role: "system" },
          }))
          .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
      }
    }

    res.status(200).json({
      success: true,
      data: fabricObj,
    });
  } catch (error) {
    console.error("Error fetching fabric:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllFabrics = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin only.",
      });
    }

    const fabrics = await Fabric.find()
      .populate({
        path: "assignments",
      })
      .sort({ createdAt: -1 });
    // Process fabrics data
    const processedFabrics = fabrics.map((fabric) => {
      const fabricObj = fabric.toObject();
      return fabricObj;
    });

    res.status(200).json({
      success: true,
      data: processedFabrics,
    });
  } catch (error) {
    console.error("Error fetching all fabrics:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getFabricById,
  getFabricWithHistory,
  getAllFabrics,
};
