const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { propertybannerAdd, propertybannerGet, propertybannerEdit, propertybannerDelete } = require("../controllers/propertybannerController");

// Define your routes
router.post('/propertybannerinsert', upload.single('image'), propertybannerAdd);
router.get('/propertybannergetdata', propertybannerGet);
router.put('/propertybannerEdit/:id', upload.single('image'), propertybannerEdit);
router.delete('/propertybannerdelete/:id', propertybannerDelete);

module.exports = router;