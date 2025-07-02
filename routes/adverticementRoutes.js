const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { advertisementAdd, advertisementGet, advertisementEdit, advertisementDelete } = require("../controllers/adverticementController");

// Define your routes
router.post('/adverticementinsert', upload.single('image'), advertisementAdd);
router.get('/adverticementgetdata', advertisementGet);
router.put('/adverticementEdit/:id', upload.single('image'), advertisementEdit);
router.delete('/adverticementdelete/:id', advertisementDelete);

module.exports = router;