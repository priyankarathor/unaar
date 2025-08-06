const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  imageurl: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
