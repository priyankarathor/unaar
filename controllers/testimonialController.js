const Testimonial = require('../model/Testimonial');
const path = require('path');

// INSERT

exports.Testimonialadd = async (req, res) => {
  try {
    const { Name, email, designation, message, star, date } = req.body;
    
    const imageUrl = req.file ? req.file.location : null;

    const newTestimonial = new Testimonial({
      imageUrl,
      Name,
      email,
      designation,
      message,
      star,
      date: date || Date.now(),
    });

    await newTestimonial.save();

    res.status(201).json({
      status: true,
      message: "Testimonial inserted successfully",
      data: newTestimonial,
    });
  } catch (error) {
    console.error('❌ Insert Error:', error);
    res.status(500).json({
      status: false,
      message: "Insert failed",
      error: error.message,
    });
  }
};

// GET
exports.TestimonialGet = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Testimonials fetched successfully",
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Fetch failed", error: error.message });
  }
};

// EDIT
exports.TestimonialEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, email, designation, message, star, date } = req.body;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ status: false, message: "Testimonial not found" });
    }

    testimonial.Name = Name;
    testimonial.email = email;
    testimonial.designation = designation;
    testimonial.message = message;
    testimonial.star = star;
    testimonial.date = date;

    if (req.file) {
      testimonial.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updated = await testimonial.save();

    res.status(200).json({
      status: true,
      message: "Testimonial updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Edit failed", error: error.message });
  }
};

// DELETE
exports.TestimonialDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ status: false, message: "Testimonial not found" });
    }

    res.status(200).json({
      status: true,
      message: "Testimonial deleted successfully",
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Delete failed", error: error.message });
  }
};
