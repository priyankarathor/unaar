const mongoose = require('mongoose');

const subtoSubCategorySchema = new mongoose.Schema({
    masterId: { type: String },
    subcategoryId: { type: String },
    mastertitle: { type: String },
    subtitle: { type: String },
    categorytype: { type: String, required: true },
    categoryvalue: { type: String, required: true },
    image: { type: String }, // Store AWS S3 URL
    action: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SubtoSubCategory', subtoSubCategorySchema);
