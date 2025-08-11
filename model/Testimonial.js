const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema({
  imageUrl: String,
  name: String,
  email: String,
  designation: String,
  message: String,
  star: Number,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Testimonial", TestimonialSchema);
