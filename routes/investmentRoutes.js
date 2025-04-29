const express = require("express");
const router = express.Router();
const upload = require('../middleware/multer'); // Middleware for handling multipart/form-data

const {
  Investeradd,
  InvestmentGet,
  InvestmentEdit,
  InvestmentDelete
} = require("../controllers/investmentController");

// POST - Create new investment with image
router.post("/investment", upload.single('image'), Investeradd);

// GET - Get all investments
router.get("/investments", InvestmentGet);

// PUT - Update investment by ID with optional image
router.put("/investment/:id", upload.single('image'), InvestmentEdit);

// DELETE - Delete investment by ID
router.delete("/investment/:id", InvestmentDelete);

module.exports = router;
