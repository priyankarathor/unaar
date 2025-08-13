const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    masterId: { type: String },
    mastertitle: { type: String },
    categorytype: { type: String, required: true },
    categoryvalue: { type: String, required: true },
    action: { type: String },
    image: { type: String }, // Store S3 URL instead of Buffer
  },
  { timestamps: true }
);

module.exports = mongoose.model("subCategory", subCategorySchema);
