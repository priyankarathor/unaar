const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    subtosubcategoryInsert, 
    subtosubcategoryGet, 
    subtosubcategoryEdit, 
    subtosubcategoryDelete 
} = require("../controllers/subtosubcategoryController");

// Use multer for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/insertcategory', upload.single('image'), subtosubcategoryInsert);
router.get('/getcategory', subtosubcategoryGet);  
router.put('/editcategory/:id', upload.single('image'), subtosubcategoryEdit);
router.delete('/deletecategory/:id', subtosubcategoryDelete);

module.exports = router;
