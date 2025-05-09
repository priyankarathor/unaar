const express = require('express');
const router = express.Router();
const multer = require('multer');

// Store uploaded files in memory as Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import the controller
const propertylistingController = require('../controllers/PropertyListingController');

// Route for inserting a property listing with images
router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'image', maxCount: 1 },               // Field for main image
    { name: 'remotelocationimage', maxCount: 1 }, // Field for remote location image
  ]),
  propertylistingController.PropertyListingInsert
);

module.exports = router;