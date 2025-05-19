const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

const SubCategorySchema = new mongoose.Schema({
    masterId: {
        type: String
    },
    mastertitle: {
        type: String,
    },
    categorytype: { type: String, required: true },
    categoryvalue: { type: String, required: true },

    // single image
    image: {
      data: Buffer,
      contentType: String
    },

    // multiple images
    images: [imageSchema],

    action: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', SubCategorySchema);
