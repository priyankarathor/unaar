const express = require('express');
const router = express.Router();
// const upload = require('../middleware/upload');
const upload = require("../middleware/multer");

const {
  Testimonialadd,
  TestimonialGet,
  TestimonialEdit,
  TestimonialDelete
} = require('../controllers/testimonialController');

// Routes
router.post('/add', upload.single('image'), Testimonialadd);
router.get('/get', TestimonialGet);
router.put('/edit/:id', upload.single('image'), TestimonialEdit);
router.delete('/delete/:id', TestimonialDelete);

module.exports = router;
