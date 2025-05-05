const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { blogadd, blogget, blogedit, blogdelete } = require("../controllers/blogController");

// Define your routes
router.post('/bloginsert', upload.single('image'), blogadd);
router.get('/bloggetdata', blogget);
router.put('/blogEdit/:id', upload.single('image'), blogedit);
router.delete('/blogdelete/:id', blogdelete);

module.exports = router;