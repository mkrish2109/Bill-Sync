const Fabric = require("../models/Fabric");
const FabricAssignment = require("../models/FabricAssignment");

const assignFabricToWorkerHelper = async ({ fabricId, workerId, buyerId }) => {
    try {
      // Check if fabric exists and belongs to buyer
      const fabric = await Fabric.findOne({ _id: fabricId, buyerId });
      if (!fabric) {
        throw new Error('Fabric not found or does not belong to you');
      }
  
      // Check if fabric is already assigned
      const existingAssignment = await FabricAssignment.findOne({ fabricId });
      
      if (existingAssignment) {
        // If trying to assign to the same worker, return error
        if (existingAssignment.workerId.toString() === workerId) {
          throw new Error('Fabric is already assigned to this worker');
        }
  
        // Update existing assignment with new worker
        existingAssignment.workerId = workerId;
        existingAssignment.status = 'reassigned';
        existingAssignment.reassignedAt = new Date();
        await existingAssignment.save();
  
        return {
          success: true,
          data: existingAssignment,
          message: 'Fabric reassigned to new worker'
        };
      }
      
      // Create new assignment if no existing assignment
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
  
      return {
        success: true,
        data: savedAssignment,
        message: 'Fabric assigned to worker'
      };
    } catch (error) {
      throw error;
    }
  };

module.exports = {
    assignFabricToWorkerHelper
}