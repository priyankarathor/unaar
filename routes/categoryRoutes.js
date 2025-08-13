const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  categoryInsert,
  categoryGet,
  categoryEdit,
  categoryDelete
} = require("../controllers/CategoryController");

// Multer config (memory storage for S3 upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/insertcategory', upload.single('image'), categoryInsert);
router.get('/getcategory', categoryGet);
router.put('/editcategory/:id', upload.single('image'), categoryEdit);
router.delete('/deletecategory/:id', categoryDelete);

module.exports = router;
