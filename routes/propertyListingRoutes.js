const express = require('express');
const router = express.Router();
const multer = require('multer');

// Set up multer to store files in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Controller import
const propertylistingController = require('../controllers/PropertyListingController');

// Route for property insertion with images
router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'image', maxCount: 1 },               // Main image
    { name: 'facilitieimage', maxCount: 1 },      // Facilities image
    { name: 'featureimage', maxCount: 1 },        // Feature image
    { name: 'remotelocationimage', maxCount: 1 }, // Remote location image
  ]),
  propertylistingController.PropertyListingInsert
);

module.exports = router;
