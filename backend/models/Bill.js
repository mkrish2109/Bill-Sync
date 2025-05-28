const mongoose = require('mongoose');

const FabricSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  unit: String
});

module.exports = mongoose.model('Bill', {
  type: { type: String, enum: ['received', 'delivered'], required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fabricDetails: [FabricSchema],
  date: { type: Date, default: Date.now },
  paymentDueInDays: Number,
  paymentDueDate: Date,
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  notified: { type: Boolean, default: false },
  note: String
});