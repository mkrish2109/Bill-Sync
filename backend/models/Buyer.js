const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  company: String,
  assignedFabrics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FabricAssignment",
    },
  ],
  fabricIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fabric",
    },
  ],
  preferences: [String],
  sentRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },
  ],
  connectedWorkers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update timestamp before saving
buyerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Buyer", buyerSchema);
