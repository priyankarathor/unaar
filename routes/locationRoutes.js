const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    locationInsert, 
    locationsGet
} = require("../controllers/locationController");

// Use multer for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/insertlocation', locationInsert);
router.get('/getlocations', locationsGet);  

module.exports = router;
