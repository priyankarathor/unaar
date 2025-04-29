const express = require("express");
const router = express.Router();
const upload = require('../middleware/multer'); // memory storage multer
const { Testimonialadd, TestimonialGet, TestimonialEdit, TestimonialDelete } = require("../controllers/testimonialController");

router.post("/Testimonialadd", upload.single('image'), Testimonialadd);

router.get("/TestimonialGet", TestimonialGet);

router.put("/TestimonialEdit/:id", upload.single('image'), TestimonialEdit);

router.delete("/TestimonialDelete/:id", TestimonialDelete);

module.exports = router;
