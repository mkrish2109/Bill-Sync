const Fabric = require("../models/Fabric");
const Buyer = require("../models/Buyer"); 
const FabricAssignment = require("../models/FabricAssignment");
const Worker = require("../models/Worker");
const User = require("../models/User");

// Create a new fabric
const createFabric = async (req, res) => {
    try {
        // Get buyerId from authenticated user
        const buyerId = req.user.userId;
        
        // Validate buyer exists
        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({
                success: false,
                error: 'Buyer not found'
            });
        }

        const { name, description, unit, quantity, unitPrice, imageUrl, workerId } = req.body;
        
        // Validate required fields
        if (!name || !description || !unit || !quantity || !unitPrice || !imageUrl) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Validate quantity and unitPrice are positive numbers
        if (quantity <= 0 || unitPrice <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Quantity and unit price must be positive numbers'
            });
        }

        // Calculate total price
        const totalPrice = quantity * unitPrice;
        
        // Create the fabric
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
        
        // Update buyer's fabricIds array
        await Buyer.findByIdAndUpdate(buyerId, {
            $push: { fabricIds: savedFabric._id }
        });

        // If workerId is provided, create an assignment
        let assignment = null;
        if (workerId) {
            // Verify worker exists
            const worker = await Worker.findById(workerId);
            if (!worker) {
                // Don't fail the whole operation if worker not found
                console.warn(`Worker with ID ${workerId} not found, skipping assignment`);
            } else {
                // Create the assignment
                assignment = new FabricAssignment({
                    fabricId: savedFabric._id,
                    buyerId,
                    workerId,
                    status: 'assigned'
                });

                await assignment.save();

                // Update fabric with assignment reference
                await Fabric.findByIdAndUpdate(savedFabric._id, {
                    $push: { assignments: assignment._id }
                });

                // Update buyer's assignedFabrics array
                await Buyer.findByIdAndUpdate(buyerId, {
                    $push: { assignedFabrics: assignment._id }
                });

                // Update worker's assignments array if your Worker model has one
                // await Worker.findByIdAndUpdate(workerId, {
                //     $push: { assignments: assignment._id }
                // });
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


// Get all fabrics
const getAllFabrics = async (req, res) => {
    try {
        const { userId, role } = req.user;
        
        // Common population options
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

        let fabrics;
        
        if (role === 'buyer') {
            // Buyer can see all their fabrics with worker assignments
            fabrics = await Fabric.find({ buyerId: userId })
                .populate(populateOptions);
            
            // Transform data for buyer view
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

            return res.status(200).json({
                success: true,
                role: 'buyer',
                count: buyerFabrics.length,
                data: buyerFabrics
            });

        } else if (role === 'worker') {
            // Worker can only see fabrics assigned to them
            const assignments = await FabricAssignment.find({ workerId: userId })
                .populate({
                    path: 'fabricId',
                    populate: [
                        {
                            path: 'buyerId',
                            select: 'name contact company'
                        },
                        {
                            path: 'assignments',
                            populate: {
                                path: 'workerId',
                                select: 'name contact'
                            }
                        }
                    ]
                });

            // Transform data for worker view
            const workerFabrics = assignments.map(assignment => {
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
                role: 'worker',
                count: workerFabrics.length,
                data: workerFabrics
            });

        } else {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized access'
            });
        }

    } catch (error) {
        console.error('Error fetching fabrics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get fabric by ID
const getFabricById = async (req, res) => {
    try {
        const fabric = await Fabric.findById(req.params.id)
            .populate('buyerId', 'name contact company')
            .populate({
                path: 'assignments',
                populate: {
                    path: 'workerId',
                    select: 'name contact'
                }
            });

        if (!fabric) {
            return res.status(404).json({
                success: false,
                error: 'Fabric not found'
            });
        }

        res.status(200).json({
            success: true,
            data: fabric
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
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
                    error: 'Fabric not found'
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
                error: 'Fabric not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedFabric
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete fabric
const  deleteFabric = async (req, res) => {
    try {
        const fabric = await Fabric.findByIdAndDelete(req.params.id);
        
        if (!fabric) {
            return res.status(404).json({
                success: false,
                error: 'Fabric not found'
            });
        }
        
        // Remove fabric reference from buyer
        await Buyer.findByIdAndUpdate(fabric.buyerId, {
            $pull: { fabricIds: fabric._id }
        });
        
        // Delete all assignments related to this fabric
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

// Get fabrics by buyer ID
const  getFabricsByBuyerId = async (req, res) => {
    try {
        const fabrics = await Fabric.find({ buyerId: req.params.buyerId })
            .populate('buyerId', 'name contact');
            
        res.status(200).json({
            success: true,
            count: fabrics.length,
            data: fabrics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
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
                error: 'Fabric not found or does not belong to the specified buyer'
            });
        }
        
        const assignment = new FabricAssignment({
            fabricId,
            buyerId,
            workerId,
            status: 'assigned'
        });
        
        const savedAssignment = await assignment.save();
        
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
    getAllFabrics,
    getFabricById,
    updateFabric,
    deleteFabric,
    getFabricsByBuyerId,
    assignFabricToWorker
};