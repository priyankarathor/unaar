// routes/propertyListingRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const propertylistingController = require('../controllers/PropertyListingController');

const storage = multer.memoryStorage();

// Define multer upload middleware
const upload = multer({ storage });

// POST request for property insertion (create)
router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'propertyimage', maxCount: 5 },
    { name: 'remotelocationimage', maxCount: 1 }
  ]),
  propertylistingController.PropertyListingInsert // Make sure this is a function
);

// GET request for all property listings
router.get('/properties', propertylistingController.getAllPropertyListings);

// GET request for a single property listing by ID

// PUT request for updating a property listing by ID
router.put(
  '/propertyedit/:id',
  upload.fields([
    { name: 'propertyimage', maxCount: 5 },
    { name: 'remotelocationimage', maxCount: 1 }
  ]),
  propertylistingController.updatePropertyListing // Make sure this is a function
);

// DELETE request for deleting a property listing by ID
router.delete('/propertydelete/:id', propertylistingController.deletePropertyListing);

module.exports = router;
