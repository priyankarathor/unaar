const express = require('express');
const upload = require('../middleware/multer'); // Import multer upload middleware
const { categoryInsert, categoryGet, categoryEdit, categoryDelete } = require("../controllers/CategoryController");

const router = express.Router();

router.post('/insertcategory', upload.single('image'), categoryInsert);

router.get('/getcategory', categoryGet);

router.put('/editcategory/:id', upload.single('image'), categoryEdit);

router.delete('/deletecategory/:id', categoryDelete);

module.exports = router;
