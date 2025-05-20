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
      const worker = await Worker.findById(workerId);
      if (!worker) {
        console.warn(`Worker with ID ${workerId} not found, skipping assignment`);
      } else {
        assignment = new FabricAssignment({
          fabricId: savedFabric._id,
          buyerId,
          workerId,
          status: 'assigned'
        });

        await assignment.save();

        await Fabric.findByIdAndUpdate(savedFabric._id, {
          $push: { assignments: assignment._id }
        });

        await Buyer.findByIdAndUpdate(buyerId, {
          $push: { assignedFabrics: assignment._id }
        });
      }
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
            select: 'name contact skills experience'
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
      const workers = fabric.assignments?.map(assignment => ({
        id: assignment.workerId?._id,
        name: assignment.workerId?.name,
        contact: assignment.workerId?.contact,
        status: assignment.status,
        assignedAt: assignment.createdAt
      })) || [];
      
      return {
        ...fabricObj,
        workers: workers,
        assignmentCount: workers.length
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
    const { quantity, unitPrice, ...otherFields } = req.body;
    const { id } = req.params;
    const userId = req.user.userId; // Assuming you have user in request

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
    
    let updateFields = { ...otherFields };
    
    if (quantity || unitPrice) {
      const newQuantity = quantity || fabric.quantity;
      const newUnitPrice = unitPrice || fabric.unitPrice;
      updateFields.totalPrice = newQuantity * newUnitPrice;
      
      if (quantity) updateFields.quantity = quantity;
      if (unitPrice) updateFields.unitPrice = unitPrice;
    }

    // Find what fields are being changed
    const modifiedFields = {};
    Object.keys(updateFields).forEach(key => {
      if (JSON.stringify(originalDoc[key]) !== JSON.stringify(updateFields[key])) {
        modifiedFields[key] = {
          previousValue: originalDoc[key],
          newValue: updateFields[key]
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

    // Add to change history
    if (changeEntries.length > 0) {
      updateFields.$push = {
        changeHistory: { $each: changeEntries }
      };
    }

    const updatedFabric = await Fabric.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('changeHistory.changedBy', 'name role');

    if (!updatedFabric) {
      return res.status(404).json({
        success: false,
        error: 'Fabric not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedFabric,
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


// Assign fabric to worker (buyer only)
const assignFabricToWorker = async (req, res) => {
  try {
    const { fabricId, workerId } = req.body;
    const buyerId = req.user.userId;

    const fabric = await Fabric.findOne({ _id: fabricId, buyerId });
    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: 'Fabric not found or does not belong to you'
      });
    }
    
    const assignment = new FabricAssignment({
      fabricId,
      buyerId,
      workerId,
      status: 'assigned'
    });
    
    const savedAssignment = await assignment.save();
    
    // Update fabric with assignment reference
    await Fabric.findByIdAndUpdate(fabricId, {
      $push: { assignments: savedAssignment._id }
    });

    res.status(201).json({
      success: true,
      data: savedAssignment
    });
  } catch (error) {
    res.status(400).json({
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
  assignFabricToWorker,
  getFabricById: commonController.getFabricById
};