require("dotenv").config();
const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const propertylistingController = require("../controllers/PropertyListingController");

// helper routes for testing single/multiple
router.post("/upload-single", upload.single("image"), (req, res) => {
  res.json({ file: req.file });
});
router.post("/upload-multiple", upload.array("images", 10), (req, res) => {
  res.json({ files: req.files });
});

// create with two fields (each max 5)
router.post(
  "/propertyinsert",
  upload.fields([
    { name: "propertyimage", maxCount: 5 },
    { name: "remotelocationimage", maxCount: 5 },
  ]),
  propertylistingController.propertyListingInsert
);
// Get All Properties
router.get('/properties', propertylistingController.getAllPropertyListings);

//get one data
router.get('/propertiesdata', propertylistingController.getAllPropertyList);

//property banner filter
router.get('/propertybannerdata', propertylistingController.propertyfilterBanner);

//property 
router.get('/propertyfilter', propertylistingController.propertyfilter);

router.get("/propertyedit/:id", propertylistingController.getPropertyById);

// Update property by ID with image uploads to S3
router.put(
  "/propertyedit/:id",
  upload.fields([
    { name: "propertyimage", maxCount: 5 },
    { name: "remotelocationimage", maxCount: 5 },
  ]),
  propertylistingController.updatePropertyListing
);

// Delete Property
router.delete('/propertydelete/:id', propertylistingController.deletePropertyListing);

//csv upload
router.post('/bulkpropertyinsert', propertylistingController.bulkInsertProperties);

module.exports = router;
