const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); // path to your multer config
const { insertTestimonial } = require('../controllers/testimonialController');

// Route to handle testimonial submission with image
router.post('/testimonialinsert', upload.single('image'), insertTestimonial);

module.exports = router;
