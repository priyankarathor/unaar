const express = require("express");
const multer = require("multer");
const router = express.Router();

// Multer memory storage for AWS S3
const upload = multer({ storage: multer.memoryStorage() });

const {
  mapAdd,
  mapGet,
  mapEdit,
  mapDelete,
  updateStatus,
  mapGetActive,
} = require("../controllers/map1controller");

router.post("/map1insert", upload.single("image"), mapAdd);
router.get("/map1getdata", mapGet);
router.get("/map1getActive", mapGetActive);
router.put("/map1edit/:id", upload.single("image"), mapEdit);
router.delete("/map1delete/:id", mapDelete);
router.put("/updatestatus/:id", updateStatus);

module.exports = router;
