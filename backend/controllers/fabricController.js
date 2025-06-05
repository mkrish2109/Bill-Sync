const Fabric = require("../models/Fabric");
const Buyer = require("../models/Buyer");
const FabricAssignment = require("../models/FabricAssignment");
const Worker = require("../models/Worker");
const mongoose = require("mongoose");

// Create a new fabric
const createFabric = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const buyerId = req.user.userId;
    const io = req.app.get("io");

    console.log("Creating fabric with Socket.IO instance:", !!io);

    const buyer = await Buyer.findById(buyerId).session(session);
    if (!buyer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        error: "Buyer not found",
      });
    }

    const { name, description, unit, quantity, unitPrice, imageUrl, workerId } =
      req.body;

    if (
      !name ||
      !description ||
      !unit ||
      !quantity ||
      !unitPrice ||
      !imageUrl
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    if (quantity <= 0 || unitPrice <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        error: "Quantity and unit price must be positive numbers",
      });
    }

    const totalPrice = quantity * unitPrice;

    const fabric = new Fabric({
      buyerId,
      name,
      description,
      unit,
      quantity,
      unitPrice,
      totalPrice,
      imageUrl,
    });

    const savedFabric = await fabric.save({ session });

    await Buyer.findByIdAndUpdate(
      buyerId,
      {
        $push: { fabricIds: savedFabric._id },
      },
      { session }
    );

    let assignment = null;
    if (workerId) {
      console.log("Creating assignment for worker:", workerId);

      // Create worker assignment
      assignment = new FabricAssignment({
        fabricId: savedFabric._id,
        buyerId,
        workerId: workerId,
        status: "assigned",
      });

      await assignment.save({ session });

      await Fabric.findByIdAndUpdate(
        savedFabric._id,
        {
          $push: { assignments: assignment._id },
        },
        { session }
      );

      await Buyer.findByIdAndUpdate(
        buyerId,
        {
          $push: { assignedFabrics: assignment._id },
        },
        { session }
      );

      // Get worker details for notification
      const worker = await Worker.findById(workerId).session(session);
      console.log("Found worker for notification:", {
        workerId,
        workerFound: !!worker,
        workerUserId: worker?.userId,
        workerName: worker?.name,
      });

      if (worker && worker.userId) {
        console.log("Creating notification for worker:", worker.userId);

        // Create notification for worker
        const notificationData = {
          fabric: savedFabric,
          buyer: buyer,
          type: "status_update",
          message: `New fabric "${name}" has been assigned to you by ${buyer.name}`,
        };

        console.log("Notification data prepared:", notificationData);

        // Store notification in database
        await createNotification(
          worker.userId,
          "status_update",
          notificationData.message,
          notificationData,
          { session } // Pass session to notification creation
        );

        // console.log("Notification stored in database");

        // Get all sockets in the worker's room
        const workerRoom = io.sockets.adapter.rooms.get(
          worker.userId.toString()
        );
        console.log("Worker room status:", {
          roomExists: !!workerRoom,
          socketCount: workerRoom?.size || 0,
          workerUserId: worker.userId.toString(),
          allRooms: Array.from(io.sockets.adapter.rooms.keys()),
        });

        // Emit notification to worker's room
        io.to(worker.userId.toString()).emit(
          "new_fabric_assignment",
          notificationData
        );
        console.log(
          "Notification emitted to worker room:",
          worker.userId.toString()
        );
      } else {
        console.log("Worker or worker.userId not found:", {
          worker: worker
            ? {
                id: worker._id,
                name: worker.name,
                hasUserId: !!worker.userId,
              }
            : null,
          workerId,
        });
      }
    }

    // If everything succeeded, commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: {
        fabric: savedFabric,
        assignment: assignment || "No assignment created",
      },
    });
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating fabric:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all fabrics
const getAllFabrics = async (req, res) => {
  try {
    const { userId, role } = req.user;

    // Common population options
    const populateOptions = [
      {
        path: "assignments",
        populate: [
          {
            path: "workerId",
            select: "name contact experience",
          },
          {
            path: "buyerId",
            select: "name contact company",
          },
        ],
      },
      {
        path: "buyerId",
        select: "name contact company",
      },
    ];

    let fabrics;

    if (role === "buyer") {
      // Buyer can see all their fabrics with worker assignments
      fabrics = await Fabric.find({ buyerId: userId }).populate(
        populateOptions
      );

      // Transform data for buyer view
      const buyerFabrics = fabrics.map((fabric) => {
        const fabricObj = fabric.toObject();
        const workers =
          fabric.assignments?.map((assignment) => ({
            id: assignment.workerId?._id,
            name: assignment.workerId?.name,
            contact: assignment.workerId?.contact,
            status: assignment.status,
            assignedAt: assignment.createdAt,
          })) || [];

        return {
          ...fabricObj,
          workers: workers,
          assignmentCount: workers.length,
        };
      });

      return res.status(200).json({
        success: true,
        role: "buyer",
        count: buyerFabrics.length,
        data: buyerFabrics,
      });
    } else if (role === "worker") {
      // Worker can only see fabrics assigned to them
      const assignments = await FabricAssignment.find({
        workerId: userId,
      }).populate({
        path: "fabricId",
        populate: [
          {
            path: "buyerId",
            select: "name contact company",
          },
          {
            path: "assignments",
            populate: {
              path: "workerId",
              select: "name contact",
            },
          },
        ],
      });

      // Transform data for worker view
      const workerFabrics = assignments.map((assignment) => {
        const fabric = assignment.fabricId;
        return {
          ...fabric.toObject(),
          assignmentStatus: assignment.status,
          assignedAt: assignment.createdAt,
          buyer: fabric.buyerId,
          // Include other workers if this fabric is assigned to multiple workers
        };
      });

      return res.status(200).json({
        success: true,
        role: "worker",
        count: workerFabrics.length,
        data: workerFabrics,
      });
    } else {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access",
      });
    }
  } catch (error) {
    console.error("Error fetching fabrics:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get fabric by ID
const getFabricById = async (req, res) => {
  try {
    const fabric = await Fabric.findById(req.params.id)
      .populate("buyerId", "name contact company")
      .populate({
        path: "assignments",
        populate: {
          path: "workerId",
          select: "name contact",
        },
      });

    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: "Fabric not found",
      });
    }

    res.status(200).json({
      success: true,
      data: fabric,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update fabric
const updateFabric = async (req, res) => {
  try {
    const { quantity, unitPrice, ...otherFields } = req.body;

    let updateFields = { ...otherFields };

    // Recalculate totalPrice if quantity or unitPrice is updated
    if (quantity || unitPrice) {
      const fabric = await Fabric.findById(req.params.id);
      if (!fabric) {
        return res.status(404).json({
          success: false,
          error: "Fabric not found",
        });
      }

      const newQuantity = quantity || fabric.quantity;
      const newUnitPrice = unitPrice || fabric.unitPrice;
      updateFields.totalPrice = newQuantity * newUnitPrice;

      if (quantity) updateFields.quantity = quantity;
      if (unitPrice) updateFields.unitPrice = unitPrice;
    }

    updateFields.updatedAt = Date.now();

    const updatedFabric = await Fabric.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedFabric) {
      return res.status(404).json({
        success: false,
        error: "Fabric not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedFabric,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete fabric
const deleteFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findByIdAndDelete(req.params.id);

    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: "Fabric not found",
      });
    }

    // Remove fabric reference from buyer
    await Buyer.findByIdAndUpdate(fabric.buyerId, {
      $pull: { fabricIds: fabric._id },
    });

    // Delete all assignments related to this fabric
    await FabricAssignment.deleteMany({ fabricId: fabric._id });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get fabrics by buyer ID
const getFabricsByBuyerId = async (req, res) => {
  try {
    const fabrics = await Fabric.find({ buyerId: req.params.buyerId }).populate(
      "buyerId",
      "name contact"
    );

    res.status(200).json({
      success: true,
      count: fabrics.length,
      data: fabrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Assign fabric to worker (creates a FabricAssignment)
const assignFabricToWorker = async (req, res) => {
  try {
    const { fabricId, buyerId, workerId } = req.body;

    // Check if fabric exists and belongs to the buyer
    const fabric = await Fabric.findOne({ _id: fabricId, buyerId });
    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: "Fabric not found or does not belong to the specified buyer",
      });
    }

    const assignment = new FabricAssignment({
      fabricId,
      buyerId,
      workerId,
      status: "assigned",
    });

    const savedAssignment = await assignment.save();

    res.status(201).json({
      success: true,
      data: savedAssignment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createFabric,
  getAllFabrics,
  getFabricById,
  updateFabric,
  deleteFabric,
  getFabricsByBuyerId,
  assignFabricToWorker,
};
