// controllers/fabric/buyerController.js
const Fabric = require("../../models/Fabric");
const Buyer = require("../../models/Buyer");
const FabricAssignment = require("../../models/FabricAssignment");
const Worker = require("../../models/Worker");
const commonController = require("./commonController");

// Create a new fabric (buyer only)
const createFabric = async (req, res) => {
  try {
    const buyerId = req.user.userId;

    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({
        success: false,
        error: 'Buyer not found'
      });
    }

    const { name, description, unit, quantity, unitPrice, imageUrl, workerId } = req.body;
    
    if (!name || !description || !unit || !quantity || !unitPrice || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    if (quantity <= 0 || unitPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity and unit price must be positive numbers'
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
      imageUrl
    });

    const savedFabric = await fabric.save();
    
    await Buyer.findByIdAndUpdate(buyerId, {
      $push: { fabricIds: savedFabric._id }
    });

    let assignment = null;
    if (workerId) {
      // Create worker assignment
      assignment = new FabricAssignment({
        fabricId: savedFabric._id,
        buyerId,
        workerId:workerId
      });

      await assignment.save();

      await Fabric.findByIdAndUpdate(savedFabric._id, {
        $push: { assignments: assignment._id }
      });

      await Buyer.findByIdAndUpdate(buyerId, {
        $push: { assignedFabrics: assignment._id }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        fabric: savedFabric,
        assignment: assignment || 'No assignment created'
      }
    });
  } catch (error) {
    console.error('Error creating fabric:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all fabrics for a buyer
const getAllFabricsForBuyer = async (req, res) => {
  try {
    const { userId } = req.user;

    const populateOptions = [
      {
        path: 'assignments',
        populate: [
          {
            path: 'workerId',
            select: 'name contact experience'
          },
          {
            path: 'buyerId',
            select: 'name contact company'
          }
        ]
      },
      {
        path: 'buyerId',
        select: 'name contact company'
      }
    ];

    const fabrics = await Fabric.find({ buyerId: userId })
      .populate(populateOptions);
        
    const buyerFabrics = fabrics.map(fabric => {
      const fabricObj = fabric.toObject();
      const buyer = fabricObj.buyerId || {};
      
      const worker1 = fabric.assignments?.map(assignment => ({
        id: assignment.workerId?._id,
        name: assignment.workerId?.name,
        contact: assignment.workerId?.contact,
        status: assignment.status,
      })) || [];
      const worker = worker1[0] || {};
      const assignments = fabric.assignments?.[0]?.toObject() || [];
      
          delete fabricObj.buyerId;
          delete fabricObj.workerId;
          delete fabricObj.assignments;

          return {
            fabric: fabricObj,
            buyer,
            worker,
            assignments,
            hasAssignment: !!worker
          };
    });

    res.status(200).json({
      success: true,
      count: buyerFabrics.length,
      data: buyerFabrics
    });
  } catch (error) {
    console.error('Error fetching fabrics:', error);
    res.status(500).json({
      success: false,
      error: error.message
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
      ...rest
    } = req.body;
    
    const { id } = req.params;
    const userId = req.user.userId;
    
    // First get the current fabric document
    const fabric = await Fabric.findById(id);
    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: 'Fabric not found'
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
    
    // Handle quantity and unitPrice together for totalPrice calculation
    if (quantity !== undefined || unitPrice !== undefined) {
      const newQuantity = quantity !== undefined ? quantity : fabric.quantity;
      const newUnitPrice = unitPrice !== undefined ? unitPrice : fabric.unitPrice;
      updateFields.quantity = newQuantity;
      updateFields.unitPrice = newUnitPrice;
      updateFields.totalPrice = newQuantity * newUnitPrice;
    }
    
    // Check if the fabric belongs to the user
    if (fabric.buyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this fabric'
      });
    }

    // Handle worker assignment if workerId is provided
    if (workerId !== undefined) {
      const currentAssignment = await FabricAssignment.findOne({ fabricId: id });
      
      if (currentAssignment) {
        if (workerId) {
          // Update existing assignment with new worker
          await FabricAssignment.findByIdAndUpdate(currentAssignment._id, {
              workerId,
              status: 'assigned'
          });
        } else {
          // Remove assignment if workerId is empty
          await FabricAssignment.findByIdAndDelete(currentAssignment._id);
          await Fabric.findByIdAndUpdate(id, {
            $pull: { assignments: currentAssignment._id }
          });
          await Buyer.findByIdAndUpdate(userId, {
            $pull: { assignedFabrics: currentAssignment._id }
          });
        }
      } else if (workerId) {
        // Create new assignment
        const newAssignment = new FabricAssignment({
          fabricId: id,
          buyerId: userId,
          workerId,
          status: 'assigned'
        });

        await newAssignment.save();

        await Fabric.findByIdAndUpdate(id, {
          $push: { assignments: newAssignment._id }
        });

        await Buyer.findByIdAndUpdate(userId, {
          $push: { assignedFabrics: newAssignment._id }
        });
      }
    }

    // Find what fields are being changed - only track actual fabric fields
    const modifiedFields = {};
    Object.keys(updateFields).forEach((field) => {
      // Skip tracking imageUrl changes
      if (field === 'imageUrl') return;
      
      if (originalDoc[field] !== updateFields[field]) {
        modifiedFields[field] = {
          previousValue: originalDoc[field],
          newValue: updateFields[field]
        };
      }
    });

    // Prepare change history entries
    const changeEntries = Object.entries(modifiedFields).map(([field, values]) => ({
      field,
      previousValue: values.previousValue,
      newValue: values.newValue,
      changedBy: userId,
      changedAt: new Date()
    }));

    // Add to change history if there are changes
    if (changeEntries.length > 0) {
      updateFields.$push = {
        changeHistory: { $each: changeEntries }
      };
    }

    // Update the fabric with all changes
    const updatedFabric = await Fabric.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).populate([
      { path: 'changeHistory.changedBy', select: 'name role' },
      { 
        path: 'assignments',
        populate: {
          path: 'workerId',
          select: 'name contact'
        }
      }
    ]);

    // Convert assignments array to object and extract worker info
    const assignment = updatedFabric.assignments?.[0]?.toObject() || {};
    const worker = assignment.workerId || {};
    const workerInfo = {
      name: worker.name,
      contact: worker.contact,
      experience: worker.experience,
      status : assignment.status
      };
    // console.log(assignment.status);
    // Remove assignments array and add assignment and worker as direct properties
    const fabricObj = updatedFabric.toObject();
    delete fabricObj.assignments;
    delete fabricObj.worker;
    delete fabricObj.changeHistory;
    fabricObj.worker = workerInfo;

    console.log(fabricObj.worker);
    if (!updatedFabric) {
      return res.status(404).json({
        success: false,
        error: 'Fabric not found'
      });
    }

    res.status(200).json({
      success: true,
      data: fabricObj,
      changes: changeEntries
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete fabric (buyer only)
const deleteFabric = async (req, res) => {
  try {
    const fabric = await Fabric.findByIdAndDelete(req.params.id);

    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: 'Fabric not found'
      });
    }

    // Find related FabricAssignments before deletion
    const assignments = await FabricAssignment.find({ fabricId: fabric._id });
    const assignmentIds = assignments.map(a => a._id);

    // Remove fabric ID and assignment IDs from buyer
    await Buyer.findByIdAndUpdate(fabric.buyerId, {
      $pull: {
        fabricIds: fabric._id,
        assignedFabrics: { $in: assignmentIds }
      }
    });

    // Delete assignments
    await FabricAssignment.deleteMany({ fabricId: fabric._id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createFabric,
  getAllFabricsForBuyer,
  updateFabric,
  deleteFabric,
  getFabricById: commonController.getFabricById
};