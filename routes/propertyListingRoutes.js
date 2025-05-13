const express = require('express');
const router = express.Router();
const multer = require('multer');
const propertylistingController = require('../controllers/PropertyListingController');

// Configure multer storage to use memory storage (for in-memory file storage as Buffer)
const storage = multer.memoryStorage();

// Define multer upload middleware
const upload = multer({ storage });

// POST request for property insertion (create)
router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'propertyimage', maxCount: 5 }, // Allow up to 5 property images
    { name: 'remotelocationimage', maxCount: 1 } // Allow 1 remote location image
  ]),
  propertylistingController.PropertyListingInsert // Ensure this is a valid function in the controller
);

// GET request for all property listings
router.get('/properties', propertylistingController.getAllPropertyListings);

// GET request for a single property listing by ID
router.get('/property/:id', propertylistingController.getPropertyListingById);

// PUT request for updating a property listing by ID
router.put(
  '/propertyedit/:id',
  upload.fields([
    { name: 'propertyimage', maxCount: 5 }, // Allow up to 5 property images
    { name: 'remotelocationimage', maxCount: 1 } // Allow 1 remote location image
  ]),
  propertylistingController.updatePropertyListing
);

// DELETE request for deleting a property listing by ID
router.delete('/propertydelete/:id', propertylistingController.deletePropertyListing);

module.exports = router;
