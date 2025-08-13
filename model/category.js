const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    categorytype: { type: String, required: true },
    categoryvalue: { type: String, required: true },
    image: { type: String, required: true }, // S3 URL
    action: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
