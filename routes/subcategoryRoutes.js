const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    subcategoryInsert,
    subcategoryBulkInsert, 
    subcategoryGet, 
    subcategoryEdit, 
    subcategoryDelete 
} = require("../controllers/subcategoryController");

// Use multer for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/insertcategory', upload.single('image'), subcategoryInsert);
router.post('/subcategoryBulkInsert', express.json(), subcategoryBulkInsert);

router.get('/getcategory', subcategoryGet);  // Get all categories or image based on categoryvalue query

router.put('/editcategory/:id', upload.single('image'), subcategoryEdit);
router.delete('/deletecategory/:id', subcategoryDelete);

module.exports = router;
