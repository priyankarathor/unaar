const express = require('express');
const router = express.Router();
const multer = require('multer');
const propertylistingController = require('../controllers/PropertyListingController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'image', maxCount: 5 },
    { name: 'remotelocationimage', maxCount: 1 }
  ]),
  propertylistingController.PropertyListingInsert
);

module.exports = router;
