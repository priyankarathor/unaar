const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const {
  TestimonialAdd,
  TestimonialGet,
  TestimonialEdit,
  TestimonialDelete
} = require("../controllers/testimonialController");

// Routes
router.post("/testimonialinsert", upload.single("image"), TestimonialAdd);
router.get("/testimonialget", TestimonialGet);
router.put("/testimonialedit/:id", upload.single("image"), TestimonialEdit);
router.delete("/testimonialdelete/:id", TestimonialDelete);

module.exports = router;
