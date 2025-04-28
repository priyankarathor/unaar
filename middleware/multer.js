const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload directory
const uploadDir = path.join(__dirname, 'uploads');

// Ensure the uploads folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });

    // Create a .gitkeep file inside uploads/ to make sure GitHub tracks the folder
    fs.writeFileSync(path.join(uploadDir, '.gitkeep'), '');
}

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

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, PNG, and WEBP image files are allowed!'));
    }
};

// Multer upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

module.exports = upload;
