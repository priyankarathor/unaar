// multerConfig.js
require("dotenv").config();
const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory for AWS or DB upload

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, JPG, and WEBP formats are allowed"), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
