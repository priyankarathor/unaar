const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const upload = require('../middleware/multer'); // multer config

router.post('/testimonialinsert', upload.single('image'), testimonialController.createTestimonial);

module.exports = router;
