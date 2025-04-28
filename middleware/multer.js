const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload directory
const uploadDir = path.join(__dirname, 'uploads');

// Ensure the uploads folder exists
fs.mkdirSync(uploadDir, { recursive: true });

// Multer Storage
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

// File filter (Only images)
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

// Upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});

module.exports = upload;
