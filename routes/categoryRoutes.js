const express = require('express');
const upload = require('../middleware/multer'); // memory multer
const { categoryInsert, categoryGet, categoryEdit, categoryDelete } = require("../controllers/CategoryController");

const router = express.Router();

// Create category (with image upload)
router.post('/insertcategory', upload.single('image'), categoryInsert);

// Get all categories
router.get('/getcategory', categoryGet);

// Edit category (with optional image upload)
router.put('/editcategory/:id', upload.single('image'), categoryEdit);

// Delete category
router.delete('/deletecategory/:id', categoryDelete);

module.exports = router;
