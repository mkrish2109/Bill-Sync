const mongoose = require("mongoose");

const changeHistorySchema = new mongoose.Schema({
  field: String, // Which field was changed
  previousValue: mongoose.Schema.Types.Mixed, // Old value
  newValue: mongoose.Schema.Types.Mixed, // New value
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: String,
});
const fabricSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    unit: {
      type: String,
      enum: ["meters", "yards"],
    },
    quantity: {
      type: Number,
    },
    unitPrice: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    imageUrl: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    assignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FabricAssignment",
      },
    ],
    changeHistory: [changeHistorySchema],
  },
  { timestamps: true }
);
fabricSchema.pre("save", function (next) {
  if (this.isNew) {
    // It's a new document, no changes to track
    return next();
  }

  const modifiedPaths = this.modifiedPaths();
  const originalDoc = this._originalDoc || {}; // We'll set this in the controller

  const changes = modifiedPaths
    .map((path) => {
      // Skip internal fields and changeHistory itself
      if (path === "changeHistory" || path === "updatedAt") return null;

      return {
        field: path,
        previousValue: originalDoc[path],
        newValue: this[path],
        changedAt: new Date(),
        changedBy: this._changedBy, // We'll set this in the controller
      };
    })
    .filter((change) => change !== null);

  if (changes.length > 0) {
    this.changeHistory = [...(this.changeHistory || []), ...changes];
  }

  next();
});

// Custom validation: if status is not 'draft', require main fields
fabricSchema.pre("validate", function (next) {
  if (this.status !== "draft") {
    if (!this.name) {
      this.invalidate("name", "Name is required when not in draft");
    }
    if (!this.description) {
      this.invalidate("description", "Description is required when not in draft");
    }
    if (!this.unit) {
      this.invalidate("unit", "Unit is required when not in draft");
    }
    if (!this.quantity) {
      this.invalidate("quantity", "Quantity is required when not in draft");
    }
    if (!this.unitPrice) {
      this.invalidate("unitPrice", "Unit price is required when not in draft");
    }
    if (!this.totalPrice) {
      this.invalidate("totalPrice", "Total price is required when not in draft");
    }
  }
  next();
});

module.exports = mongoose.model("Fabric", fabricSchema);
