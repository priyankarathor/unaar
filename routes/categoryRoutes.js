const express = require('express');
const upload = require('../middleware/multer'); // Import multer upload middleware
const { categoryInsert, categoryGet, categoryEdit, categoryDelete } = require("../controllers/CategoryController");

const router = express.Router();

// Route to insert a new category with image upload
router.post('/insertcategory', upload.single('image'), categoryInsert);

// Route to get all categories
router.get('/getcategory', categoryGet);

// Route to edit an existing category by ID with image upload
router.put('/editcategory/:id', upload.single('image'), categoryEdit);

// Route to delete a category by ID
router.delete('/deletecategory/:id', categoryDelete);

module.exports = router;
