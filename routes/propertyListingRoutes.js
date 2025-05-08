const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer storage (optional)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const propertylisting = require('../controllers/PropertyListingController');

// Accept multiple fields with possible file uploads
router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'facilitieimage', maxCount: 1 },
    { name: 'remotelocationimage', maxCount: 1 }
  ]),
  propertylisting.PropertyListingInsert
);

module.exports = router;
