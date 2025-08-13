const express = require('express');
const multer = require('multer');
const {
  categoryInsert,
  categoryGet,
  categoryEdit,
  categoryDelete
} = require("../controllers/CategoryController");

const router = express.Router();

// Multer memory storage for S3
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post('/insertcategory', upload.single('image'), categoryInsert);
router.get('/getcategory', categoryGet);
router.put('/editcategory/:id', upload.single('image'), categoryEdit);
router.delete('/deletecategory/:id', categoryDelete);

module.exports = router;
