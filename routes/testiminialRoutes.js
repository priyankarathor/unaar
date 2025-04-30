const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
    Testimonialadd,
    TestimonialGet,
    TestimonialEdit,
    TestimonialDelete,
    getTestimonialImage
} =  require("../controllers/testimonialController");

router.post("/testimonialinsert", upload.single('image'), Testimonialadd);
router.get("/testimonialget", TestimonialGet);
router.put("/testimonialedit/:id", upload.single('image'), TestimonialEdit);
router.delete("/testimonialdelete/:id", TestimonialDelete);
router.get("/testimonial/image/:id", getTestimonialImage);

module.exports = router;
