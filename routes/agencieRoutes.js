const express = require("express");
const router = express.Router();
const upload = require('../middleware/multer'); // memory storage multer
const { agenciesadd, agenciesget, agenciesedit, agenciesdelete } = require("../controllers/agencieController");

// POST - Add new agency
router.post("/agencieinsert", upload.single('image'), agenciesadd);

// GET - Fetch all agencies
router.get("/agenciesgetdata", agenciesget);

// PUT - Update agency by ID
router.put("/agenciesEdit/:id", upload.single('image'), agenciesedit);

// DELETE - Delete agency by ID
router.delete("/agenciedelete/:id", agenciesdelete);

module.exports = router;
