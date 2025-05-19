const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    subcategoryInsert, 
    subcategoryGet, 
    subcategoryEdit, 
    subcategoryDelete 
} = require("../controllers/subcategoryController");

// Use multer for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/insertcategory', upload.any(), subcategoryInsert);  // Multiple files
router.get('/getcategory', subcategoryGet);
router.put('/editcategory/:id', upload.single('image'), subcategoryEdit); // Single file
router.delete('/deletecategory/:id', subcategoryDelete);


module.exports = router;
