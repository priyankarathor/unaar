const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // Store in memory for S3 upload

const offerController = require("../controllers/offercontroller");

// CRUD Routes
router.post("/offerinsert", upload.single("image"), offerController.offerInsert);
router.get("/offerget", offerController.offersGet);
router.put("/offeredit/:id", upload.single("image"), offerController.offerEdit);
router.delete("/offerdelete/:id", offerController.offerDelete);

module.exports = router;
