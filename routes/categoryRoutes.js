const express = require('express');
const upload = require('../middleware/multer'); 
const router = express.Router();
const {categoryInsert, categoryGet, categoryEdit, categoryDelete} = require("../controllers/CategoryController");

// Route to insert category
router.post('/insertcategory', upload.single('image'), categoryInsert);

// Route to get all categories
router.get('/getcategory', categoryGet);

// Route to edit category
router.put('/editcategory/:id', upload.single('image'), categoryEdit);

// Route to delete category
router.delete('/deletecategory/:id', categoryDelete);

module.exports = router;
