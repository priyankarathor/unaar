const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Testimonial = require("../model/Testimonial");

// AWS Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  region: process.env.AWS_REGION.trim(),
});

//this download s3 server
const s3 = new AWS.S3();

// Add Testimonial
exports.Testimonialadd = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const data = await s3.upload(params).promise();
      imageUrl = data.Location;
    }

    const testimonial = new Testimonial({
      imageUrl,
      name: req.body.name,
      email: req.body.email,
      designation: req.body.designation,
      message: req.body.message,
      star: req.body.star
    });

    await testimonial.save();
    res.status(201).json({ message: "✅ Testimonial added", testimonial });
  } catch (error) {
    console.error("❌ Add Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Testimonials
exports.TestimonialGet = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Testimonial
exports.TestimonialEdit = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      designation: req.body.designation,
      message: req.body.message,
      star: req.body.star
    };

    if (req.file) {
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const data = await s3.upload(params).promise();
      updateData.imageUrl = data.Location;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "✅ Testimonial updated", testimonial });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Testimonial
exports.TestimonialDelete = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "✅ Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
