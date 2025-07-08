const Fabric = require("../../models/Fabric");
const Buyer = require("../../models/Buyer");
const FabricAssignment = require("../../models/FabricAssignment");
const Worker = require("../../models/Worker");
const commonController = require("./commonController");
const { createNotification } = require("../notificationController");
const path = require("path");
const fs = require("fs");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinaryUpload");
const UPLOAD_TARGET = process.env.UPLOAD_TARGET || "local";

// Create a new fabric (buyer only)
const createFabric = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const io = req.app.get("io");

    // console.log("Creating fabric with Socket.IO instance:", !!io);

    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({
        success: false,
        error: "Buyer not found",
      });
    }

    const {
      name,
      description,
      unit,
      quantity,
      unitPrice,
      imageUrl,
      workerId,
      status = "draft",
    } = req.body;

    // Allow incomplete data if status is 'draft'
    let totalPrice = undefined;
    if (quantity && unitPrice) {
      totalPrice = quantity * unitPrice;
    }

    const fabric = new Fabric({
      buyerId,
      name,
      description,
      unit,
      quantity,
      unitPrice,
      totalPrice,
      imageUrl,
      status,
    });

    // If status is not draft, check required fields
    if (status !== "draft") {
      if (!name || !description || !unit || !quantity || !unitPrice) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields for active fabric",
        });
      }
    }

    const savedFabric = await fabric.save();

    await Buyer.findByIdAndUpdate(buyerId, {
      $push: { fabricIds: savedFabric._id },
    });

    let assignment = null;
    // If workerId is provided and status is not draft, create assignment
    if (workerId && status !== "draft") {
      // console.log("Creating assignment for worker:", workerId);

      // Create worker assignment
      assignment = new FabricAssignment({
        fabricId: savedFabric._id,
        buyerId,
        workerId: workerId,
        status: "assigned",
      });

      await assignment.save();

      await Fabric.findByIdAndUpdate(savedFabric._id, {
        $push: { assignments: assignment._id },
      });

      await Buyer.findByIdAndUpdate(buyerId, {
        $push: { assignedFabrics: assignment._id },
      });

      // Get worker details for notification
      const worker = await Worker.findById(workerId);
      // console.log("Found worker for notification:", {
      //   workerId,
      //   workerFound: !!worker,
      //   workerUserId: worker?.userId,
      //   workerName: worker?.name,
      // });

      if (worker && worker.userId) {
        // console.log("Creating notification for worker:", worker.userId);

        // Create notification for worker
        const notificationData = {
          fabric: savedFabric,
          buyer: buyer,
          type: "status_update",
          message: `New fabric "${name}" has been assigned to you by ${buyer.name}`,
        };

        // console.log("Notification data prepared:", notificationData);

        // Store notification in database
        await createNotification(
          worker.userId,
          "status_update",
          notificationData.message,
          notificationData
        );

        // console.log("Notification stored in database");

        // Get all sockets in the worker's room
        const workerRoom = io.sockets.adapter.rooms.get(
          worker.userId.toString()
        );
        // console.log("Worker room status:", {
        //   roomExists: !!workerRoom,
        //   socketCount: workerRoom?.size || 0,
        //   workerUserId: worker.userId.toString(),
        //   allRooms: Array.from(io.sockets.adapter.rooms.keys()),
        // });

        // Emit notification to worker's room
        io.to(worker.userId.toString()).emit(
          "new_fabric_assignment",
          notificationData
        );
        // console.log(
        //   "Notification emitted to worker room:",
        //   worker.userId.toString()
        // );
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

    res.status(201).json({
      success: true,
      data: {
        fabric: savedFabric,
        assignment: assignment || "No assignment created",
      },
    });
  } catch (error) {
    console.error("Error creating fabric:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all fabrics for a buyer
const getAllFabricsForBuyer = async (req, res) => {
  try {
    const { userId } = req.user;

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

    const fabrics = await Fabric.find({ buyerId: userId }).populate(
      populateOptions
    );
    // console.log(fabrics);
    const buyerFabrics = fabrics.map((fabric) => {
      const fabricObj = fabric.toObject();
      const buyer = fabricObj.buyerId || {};
      const worker = fabricObj.assignments?.[0]?.workerId || {};
      const assignment = fabric.assignments?.[0]?.toObject?.() || {};

      delete fabricObj.buyerId;
      delete fabricObj.workerId;
      delete fabricObj.assignments;
      delete assignment.workerId;
      delete assignment.buyerId;

      return {
        fabric: fabricObj,
        buyer,
        worker,
        assignments: assignment,
        hasAssignment: !!worker.id,
      };
    });

    res.status(200).json({
      success: true,
      count: buyerFabrics.length,
      data: buyerFabrics,
    });
  } catch (error) {
    console.error("Error fetching fabrics:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update fabric (buyer only)
const updateFabric = async (req, res) => {
  try {
    const {
      name,
      description,
      unit,
      quantity,
      unitPrice,
      imageUrl,
      workerId,
      buyerId,
      status,
      ...rest
    } = req.body;

    const { id } = req.params;
    const userId = req.user.userId;
    const io = req.app.get("io");

    // First get the current fabric document
    const fabric = await Fabric.findById(id);
    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: "Fabric not found",
      });
    }

    // Store the original document for change tracking
    const originalDoc = fabric.toObject();

    // Prepare update fields - only include actual fabric fields
    const updateFields = {};

    // Only update fields that are provided in the request
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (unit !== undefined) updateFields.unit = unit;
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;
    if (status !== undefined) updateFields.status = status;

    // Handle quantity and unitPrice together for totalPrice calculation
    if (quantity !== undefined || unitPrice !== undefined) {
      const newQuantity = quantity !== undefined ? quantity : fabric.quantity;
      const newUnitPrice =
        unitPrice !== undefined ? unitPrice : fabric.unitPrice;
      updateFields.quantity = newQuantity;
      updateFields.unitPrice = newUnitPrice;
      updateFields.totalPrice =
        newQuantity && newUnitPrice ? newQuantity * newUnitPrice : undefined;
    }

    // Check if the fabric belongs to the user
    if (fabric.buyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to update this fabric",
      });
    }

    // If status is being set to 'active', check required fields
    if (
      (status === "active" || updateFields.status === "active") &&
      ((!updateFields.name && !fabric.name) ||
        (!updateFields.description && !fabric.description) ||
        (!updateFields.unit && !fabric.unit) ||
        (!updateFields.quantity && !fabric.quantity) ||
        (!updateFields.unitPrice && !fabric.unitPrice) ||
        (!updateFields.imageUrl && !fabric.imageUrl))
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields for active fabric",
      });
    }

    // Handle worker assignment if workerId is provided and status is not draft
    if (
      workerId !== undefined &&
      status !== "draft" &&
      updateFields.status !== "draft"
    ) {
      const currentAssignment = await FabricAssignment.findOne({
        fabricId: id,
      });
      const buyer = await Buyer.findById(userId);

      if (currentAssignment) {
        if (workerId) {
          // Update existing assignment with new worker
          await FabricAssignment.findByIdAndUpdate(currentAssignment._id, {
            workerId,
            status: "assigned",
          });

          // Get worker details for notification
          const worker = await Worker.findById(workerId);
          if (worker && worker.userId) {
            // Create notification for worker
            const notificationData = {
              fabric: { ...fabric.toObject(), ...updateFields },
              buyer: buyer,
              type: "status_update",
              message: `Fabric "${
                name || fabric.name
              }" has been assigned to you by ${buyer.name}`,
            };

            // Store notification in database
            await createNotification(
              worker.userId,
              "status_update",
              notificationData.message,
              notificationData
            );

            // Emit notification to worker's room
            io.to(worker.userId.toString()).emit(
              "new_fabric_assignment",
              notificationData
            );
          }
        } else {
          // Remove assignment if workerId is empty
          await FabricAssignment.findByIdAndDelete(currentAssignment._id);
          await Fabric.findByIdAndUpdate(id, {
            $pull: { assignments: currentAssignment._id },
          });
          await Buyer.findByIdAndUpdate(userId, {
            $pull: { assignedFabrics: currentAssignment._id },
          });
        }
      } else if (workerId) {
        // Create new assignment
        const newAssignment = new FabricAssignment({
          fabricId: id,
          buyerId: userId,
          workerId,
          status: "assigned",
        });

        await newAssignment.save();

        await Fabric.findByIdAndUpdate(id, {
          $push: { assignments: newAssignment._id },
        });

        await Buyer.findByIdAndUpdate(userId, {
          $push: { assignedFabrics: newAssignment._id },
        });

        // Get worker details for notification
        const worker = await Worker.findById(workerId);
        if (worker && worker.userId) {
          // Create notification for worker
          const notificationData = {
            fabric: { ...fabric.toObject(), ...updateFields },
            buyer: buyer,
            type: "status_update",
            message: `New fabric "${
              name || fabric.name
            }" has been assigned to you by ${buyer.name}`,
          };

          // Store notification in database
          await createNotification(
            worker.userId,
            "status_update",
            notificationData.message,
            notificationData
          );

          // Emit notification to worker's room
          io.to(worker.userId.toString()).emit(
            "new_fabric_assignment",
            notificationData
          );
        }
      }
    }

    // Find what fields are being changed - only track actual fabric fields
    const modifiedFields = {};
    Object.keys(updateFields).forEach((field) => {
      // Skip tracking imageUrl changes
      if (field === "imageUrl") return;

      if (originalDoc[field] !== updateFields[field]) {
        modifiedFields[field] = {
          previousValue: originalDoc[field],
          newValue: updateFields[field],
        };
      }
    });

    // Prepare change history entries
    const changeEntries = Object.entries(modifiedFields).map(
      ([field, values]) => ({
        field,
        previousValue: values.previousValue,
        newValue: values.newValue,
        changedBy: userId,
        changedAt: new Date(),
      })
    );

    // Add to change history if there are changes
    if (changeEntries.length > 0) {
      updateFields.$push = {
        changeHistory: { $each: changeEntries },
      };
    }

    // Update the fabric with all changes
    const updatedFabric = await Fabric.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "changeHistory.changedBy", select: "name role" },
      {
        path: "assignments",
        populate: {
          path: "workerId",
          select: "name contact",
        },
      },
    ]);

    // Convert assignments array to object and extract worker info
    const assignment = updatedFabric.assignments?.[0]?.toObject() || {};
    const worker = assignment.workerId || {};
    const workerInfo = {
      name: worker.name,
      contact: worker.contact,
      experience: worker.experience,
      status: assignment.status,
    };
    // console.log(assignment.status);
    // Remove assignments array and add assignment and worker as direct properties
    const fabricObj = updatedFabric.toObject();
    delete fabricObj.assignments;
    delete fabricObj.worker;
    delete fabricObj.changeHistory;
    fabricObj.worker = workerInfo;

    if (!updatedFabric) {
      return res.status(404).json({
        success: false,
        error: "Fabric not found",
      });
    }

    res.status(200).json({
      success: true,
      data: fabricObj,
      changes: changeEntries,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete fabric (buyer only)
const deleteFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findById(req.params.id);

    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: "Fabric not found",
      });
    }

    // Delete the image file if it exists
    if (fabric.imageUrl) {
      const filename = fabric.imageUrl.split("/").pop();
      if (UPLOAD_TARGET === "cloudinary") {
        const publicId = filename.replace(/\.[^/.]+$/, ""); // removes extension
        await deleteFromCloudinary(publicId);
      } else {
        const filePath = path.join(__dirname, "../../uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Delete the fabric document
    await Fabric.findByIdAndDelete(req.params.id);

    // Find related FabricAssignments before deletion
    const assignments = await FabricAssignment.find({ fabricId: fabric._id });
    const assignmentIds = assignments.map((a) => a._id);

    // Remove fabric ID and assignment IDs from buyer
    await Buyer.findByIdAndUpdate(fabric.buyerId, {
      $pull: {
        fabricIds: fabric._id,
        assignedFabrics: { $in: assignmentIds },
      },
    });

    // Delete assignments
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

module.exports = {
  createFabric,
  getAllFabricsForBuyer,
  updateFabric,
  deleteFabric,
  getFabricById: commonController.getFabricById,
};
