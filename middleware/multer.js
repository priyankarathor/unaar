const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set upload directory
const uploadDir = path.join(__dirname, 'uploads');

// Ensure uploads folder exists
fs.mkdir(uploadDir, { recursive: true }, (err) => {
    if (err) {
        console.error('❌ Failed to create uploads folder:', err);
    } else {
        console.log('✅ Uploads folder is ready.');
    }
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extName = path.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${extName}`);
    }
});

// File filter: Only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, PNG, and WEBP images are allowed!'));
    }
};

// Create multer upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit file size to 5MB
});

module.exports = upload;
