const AWS = require('aws-sdk');
const Testimonial = require('../model/Testimonial');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.createTestimonial = async (req, res) => {
  try {
    const { name, title, description } = req.body;
    let imageUrl = '';

    if (req.file) {
      const fileContent = req.file.buffer;
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
      };

      const uploadResult = await s3.upload(params).promise();
      imageUrl = uploadResult.Location;
    }

    const newTestimonial = new Testimonial({
      name,
      title,
      description,
      imageurl: imageUrl,
    });

    await newTestimonial.save();

    res.status(201).json({ success: true, message: 'Testimonial created', data: newTestimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
