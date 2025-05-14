const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    subtosubcityInsert, 
    subtosubcityGet, 
    subtosubcityEdit, 
    subtosubcityDelete 
} = require("../controllers/cityController");

// Use multer for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/insertcity', upload.single('image'), subtosubcityInsert);
router.get('/getcity', subtosubcityGet);  
router.put('/editcity/:id', upload.single('image'), subtosubcityEdit);
router.delete('/deletecity/:id', subtosubcityDelete);

module.exports = router;
