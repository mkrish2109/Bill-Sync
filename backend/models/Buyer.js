const mongoose = require('mongoose');
module.exports = mongoose.model('Buyer', {
  name: String,
  contact: String,
  assignedFabrics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FabricAssignment' }]
});
