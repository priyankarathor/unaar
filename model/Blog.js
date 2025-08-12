const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  image: { type: String }, // AWS S3 URL
  action: { type: String },
  date: { type: Date, default: Date.now },
  categorytitle: { type: String },
  categorylable: { type: String },
  categoryValue: { type: String },
  categoryType: { type: String },
  authername: { type: String },
  metatitle: { type: String },
  metadescription: { type: String },
  metakeyword: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
