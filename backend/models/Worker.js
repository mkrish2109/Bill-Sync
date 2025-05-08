const mongoose = require('mongoose');
module.exports = mongoose.model('Worker', {
  name: String,
  contact: String
});
