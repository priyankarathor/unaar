const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const propertylisting = require('../controllers/PropertyListingController');

router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'facilitieimage', maxCount: 1 },
    { name: 'featureimage', maxCount: 1 },
    { name: 'remotelocationimage', maxCount: 1 }
  ]),
  propertylisting.PropertyListingInsert
);

module.exports = router;
