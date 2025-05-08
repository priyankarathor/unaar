const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const propertylisting = require('../controllers/PropertyListingController');

router.post('/propertyinsert', upload.single('image'), propertylisting.PropertyListingInsert);
// router.get('/propertyget',propertylisting.PropertyListingGet);
// router.put('/PropertyListingEdit/:id', upload.single('image'), propertylisting.PropertyListingEdit);
// router.delete('/PropertyListingDelete/:id', propertylisting.PropertyListingDelete)

module.exports = router;