// models/FabricAssignment.js (backend)
const mongoose = require('mongoose');

const fabricAssignmentSchema = new mongoose.Schema({
  fabricId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fabric', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['assigned', 'in-progress', 'completed'], 
    default: 'assigned' 
  }, // Status to track the work process
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FabricAssignment', fabricAssignmentSchema);
