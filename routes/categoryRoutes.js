const express = require('express');
const router = express.Router();
const multer = require('multer');
const { categoryInsert, categoryGet, categoryEdit, categoryDelete,getcategoryImage } = require("../controllers/CategoryController");

// Use multer for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/insertcategory', upload.single('image'), categoryInsert);
router.get('/getcategory', categoryGet);
router.put('/editcategory/:id', upload.single('image'), categoryEdit);
router.delete('/deletecategory/:id', categoryDelete);
router.get('/getcategoryimage/:id', getcategoryImage);
module.exports = router;