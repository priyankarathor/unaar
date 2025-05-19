const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory, adjust if you want disk storage
const upload = multer({ storage });

module.exports = upload;
