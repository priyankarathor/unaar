const express = require("express");
const router = express.Router();

const {
  AdvertiseAdd,
  AdvertiseGet,
  AdvertiseEdit,
  AdvertiseDelete
} = require("../controllers/advertiseController");

// POST - Create new advertise
router.post("/advertise", AdvertiseAdd);

// GET - Get all advertises
router.get("/advertises", AdvertiseGet);

// PUT - Update advertise by ID
router.put("/advertise/:id", AdvertiseEdit);

// DELETE - Delete advertise by ID
router.delete("/advertise/:id", AdvertiseDelete);

module.exports = router;