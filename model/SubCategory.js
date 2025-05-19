const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
  data: Buffer,
  contentType: String
});

const SubCategorySchema = new Schema({
  masterId: {
    type: String,
    required: true,
  },
  mastertitle: {
    type: String,
    default: '',
  },
  categorytype: {
    type: String,
    required: true
  },
  categoryvalue: {
    type: String,
    required: true
  },
  // Single image (optional)
  image: {
    data: Buffer,
    contentType: String
  },
  // Multiple images (optional)
  images: [imageSchema],
  action: {
    type: String,
    default: 'Active',
  }
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', SubCategorySchema);
