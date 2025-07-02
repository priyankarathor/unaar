const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  Country: { type: String, required: true },
  State: { type: String, required: true },
  City: { type: String, required: true },
  locationlable: { type: String, required: true },
  PropertyId: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);
