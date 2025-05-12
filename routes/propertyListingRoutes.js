const express = require('express');
const router = express.Router();
const multer = require('multer');
const propertylistingController = require('../controllers/PropertyListingController');

// Configure multer storage to use memory storage
const storage = multer.memoryStorage();

// Define multer upload middleware: 
// It handles file uploads for 'image' (multiple, max 5 files) and 'remotelocationimage' (1 file)
const upload = multer({ storage });

// Handle POST request for property insertion
router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'images', maxCount: 5 },  // 'images' field allows multiple image files (max 5)
    { name: 'remotelocationimage', maxCount: 1 }  // 'remotelocationimage' field allows 1 image
  ]),
  propertylistingController.PropertyListingInsert  // Call the controller function for insertion
);

module.exports = router;
