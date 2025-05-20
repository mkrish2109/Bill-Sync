const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  skills: [String],
  experience: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Worker', workerSchema);
