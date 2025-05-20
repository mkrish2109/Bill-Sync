const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  previousStatus: String,
  newStatus: String,
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
});

const fabricAssignmentSchema = new mongoose.Schema({
  fabricId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fabric', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
  status: { 
    type: String, 
    enum: ['assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'assigned'
  },
  statusHistory: [statusHistorySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

fabricAssignmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FabricAssignment', fabricAssignmentSchema);