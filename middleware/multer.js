const multer = require('multer');

// Memory storage (store files in memory as Buffer)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;