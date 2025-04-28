const express = require('express');
const upload = require('../middleware/multer'); 
// const upload = require('../middleware/uploads');
const { categoryInsert, categoryGet, categoryEdit, categoryDelete } = require("../controllers/CategoryController");

const router = express.Router();

// Route
router.post('/insertcategory', upload.single('image'), categoryInsert);
router.get('/getcategory', categoryGet);
router.put('/editcategory/:id', upload.single('image'), categoryEdit);
router.delete('/deletecategory/:id', categoryDelete);

module.exports = router;
