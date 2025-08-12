const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // store in memory for S3 upload
const {
  Investeradd,
  InvestmentGet,
  InvestmentEdit,
  InvestmentDelete,
} = require("../controllers/investmentController");

// Routes
router.post("/investment", upload.single("image"), Investeradd);
router.get("/investments", InvestmentGet);
router.put("/investmentedit/:id", upload.single("image"), InvestmentEdit);
router.delete("/investment/:id", InvestmentDelete);

module.exports = router;
