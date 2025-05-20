const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  company: String,
  assignedFabrics: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FabricAssignment' 
  }],
  fabricIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Fabric' 
  }],
  preferences: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Buyer', buyerSchema);