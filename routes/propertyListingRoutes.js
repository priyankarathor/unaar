require("dotenv").config();
const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");
const ctrl = require("../controllers/PropertyListingController");

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
  ctrl.propertyListingInsert
);

// get all
router.get("/properties", ctrl.getAllPropertyListings);

// get latest (single)
router.get("/propertiesdata", ctrl.getLatestPropertyListing);

// filter
router.get("/propertyfilter", ctrl.propertyfilter);

// get by id
router.get("/property/:id", ctrl.getPropertyById);

// update - uploads optional images
router.put(
  "/propertyedit/:id",
  upload.fields([
    { name: "propertyimage", maxCount: 5 },
    { name: "remotelocationimage", maxCount: 5 },
  ]),
  ctrl.updatePropertyListing
);

// delete
router.delete("/propertydelete/:id", ctrl.deletePropertyListing);

module.exports = router;
