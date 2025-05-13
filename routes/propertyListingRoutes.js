// routes/propertyListingRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const propertylistingController = require('../controllers/PropertyListingController');

// Configure multer storage to use memory storage
const storage = multer.memoryStorage();

// Define multer upload middleware
const upload = multer({ storage });

// POST request for property insertion (create)
router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'propertyimage', maxCount: 10 },
    { name: 'remotelocationimage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        // Destructure your other form fields here
        title,
        subtitle,
        // ...other fields
      } = req.body;

      // Store images as buffers
      const propertyImages = (req.files['propertyimage'] || []).map(file => file.buffer);
      const remoteLocationImage = req.files['remotelocationimage']?.[0]?.buffer || null;

      // Save to MongoDB (example)
      const newProperty = new PropertyModel({
        title,
        subtitle,
        // Add other form fields from req.body
        propertyimage: propertyImages,
        remotelocationimage: remoteLocationImage
      });

      await newProperty.save();
      res.status(200).json({ message: 'Property created successfully' });

    } catch (err) {
      console.error('Insert Error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
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
