const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
  advertisementAdd,
  advertisementGet,
  advertisementEdit,
  advertisementDelete,
} = require("../controllers/adverticementController");

router.post("/advertisementinsert", upload.single("image"), advertisementAdd);
router.get("/advertisementgetdata", advertisementGet);
router.put("/advertisementedit/:id", upload.single("image"), advertisementEdit);
router.delete("/advertisementdelete/:id", advertisementDelete);

module.exports = router;
