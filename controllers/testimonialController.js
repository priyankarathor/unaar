const Testimonial = require('../model/Testimonial'); // your Mongoose model

const insertTestimonial = async (req, res) => {
  try {
    const { name, position, description } = req.body;

    // Ensure file was uploaded
    if (!req.file || !req.file.location) {
      return res.status(400).json({ error: 'Image upload failed or missing' });
    }

    const newTestimonial = new Testimonial({
      name,
      position,
      description,
      image: req.file.location, // S3 URL
    });

    await newTestimonial.save();

    res.status(201).json({ message: 'Testimonial added successfully', testimonial: newTestimonial });
  } catch (error) {
    console.error('Insert Testimonial Error:', error);
    res.status(500).json({ error: 'Server Error while adding testimonial' });
  }
};

module.exports = {
  insertTestimonial,
};
