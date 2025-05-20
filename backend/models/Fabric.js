const mongoose = require("mongoose");

const changeHistorySchema = new mongoose.Schema({
  field: String,           // Which field was changed
  previousValue: mongoose.Schema.Types.Mixed, // Old value
  newValue: mongoose.Schema.Types.Mixed,      // New value
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
});
const fabricSchema = new mongoose.Schema({
    buyerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        enum: ['meters', 'yards'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FabricAssignment'
    }],
    changeHistory: [changeHistorySchema],

},{ timestamps: true });
fabricSchema.pre('save', function(next) {
  if (this.isNew) {
    // It's a new document, no changes to track
    return next();
  }

  const modifiedPaths = this.modifiedPaths();
  const originalDoc = this._originalDoc || {}; // We'll set this in the controller

  const changes = modifiedPaths.map(path => {
    // Skip internal fields and changeHistory itself
    if (path === 'changeHistory' || path === 'updatedAt') return null;
    
    return {
      field: path,
      previousValue: originalDoc[path],
      newValue: this[path],
      changedAt: new Date(),
      changedBy: this._changedBy // We'll set this in the controller
    };
  }).filter(change => change !== null);

  if (changes.length > 0) {
    this.changeHistory = [...(this.changeHistory || []), ...changes];
  }

  next();
});
 


module.exports = mongoose.model('Fabric', fabricSchema);
