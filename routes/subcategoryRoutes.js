const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  subcategoryInsert,
  subcategoryBulkInsert,
  subcategoryGet,
  subcategoryEdit,
  subcategoryDelete,
} = require("../controllers/subcategoryController");

// Multer storage in memory (for AWS upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post("/insertcategory", upload.single("image"), subcategoryInsert);
router.post("/subcategoryBulkInsert", express.json(), subcategoryBulkInsert);

router.get("/getcategory", subcategoryGet);
router.put("/editcategory/:id", upload.single("image"), subcategoryEdit);
router.delete("/deletecategory/:id", subcategoryDelete);

module.exports = router;
