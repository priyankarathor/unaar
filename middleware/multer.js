require("dotenv").config();
const multer = require("multer");

// Store file in memory (not on disk) for manual S3 upload in controller
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, JPG, and WEBP formats are allowed"), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
