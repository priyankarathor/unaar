const express = require('express');
const router = express.Router();
const multer = require('multer');
const propertylistingController = require('../controllers/PropertyListingController');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, or WEBP images are allowed.'));
    }
  }
});

// CSV Import
// router.post('/import-csv', upload.single('file'), propertylistingController.importCSV);



// Insert Property
router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'propertyimage', maxCount: 10 },
    { name: 'remotelocationimage', maxCount: 10 }
  ]),
  propertylistingController.PropertyListingInsert
);

// Get All Properties
router.get('/properties', propertylistingController.getAllPropertyListings);

router.get('/propertiesdata', propertylistingController.getAllPropertyList);

router.get('/propertyfilter', propertylistingController.propertyfilter);

// Get Property by ID
// Update Property
router.put(
  '/propertyedit/:id',
  upload.fields([
    { name: 'propertyimage', maxCount: 5 },
    { name: 'remotelocationimage', maxCount: 1 }
  ]),
  propertylistingController.updatePropertyListing
);

// Delete Property
router.delete('/propertydelete/:id', propertylistingController.deletePropertyListing);

module.exports = router;
