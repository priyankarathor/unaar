const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { adverticementadd, adverticementget, adverticementedit, adverticementdelete } = require("../controllers/adverticementController");

// Define your routes
router.post('/adverticementinsert', upload.single('image'), adverticementadd);
router.get('/adverticementgetdata', adverticementget);
router.put('/adverticementEdit/:id', upload.single('image'), adverticementedit);
router.delete('/adverticementdelete/:id', adverticementdelete);

module.exports = router;