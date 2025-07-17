const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const propertylistingController = require('../controllers/PropertyListingController');

// const storage = multer.memoryStorage();

// const upload = multer({ storage: storage });
// CSV Import
// router.post('/import-csv', upload.single('file'), propertylistingController.importCSV);

// Insert Property
router.post(
  '/propertyinsert',
  upload.fields([
    { name: 'propertyimage', maxCount: 10 },
    { name: 'remotelocationimage', maxCount: 5 }
  ]),
  propertylistingController.PropertyListingInsert
);

// Get All Properties
router.get('/properties', propertylistingController.getAllPropertyListings);

//get one data
router.get('/propertiesdata', propertylistingController.getAllPropertyList);

//property banner filter
router.get('/propertybannerdata', propertylistingController.propertyfilterBanner);

//property 
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

//CSV BULK
router.post('/bulkpropertyinsert', upload.none(), propertylistingController.bulkInsertProperties);

module.exports = router;
