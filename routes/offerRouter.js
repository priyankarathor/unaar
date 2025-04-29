const express = require("express");
const router = express.Router();
const upload = require('../middleware/multer');
const {
    offerInsert,
    offersGet,
    offerEdit,
    offerDelete
} = require("../controllers/offercontroller");

// POST - Add new offer
router.post("/offerinsert", upload.single('image'), offerInsert);

// GET - Get all offers
router.get("/offersget", offersGet);

// PUT - Update offer
router.put("/offeredit/:id", upload.single('image'), offerEdit);

// DELETE - Delete offer
router.delete("/offerdelete/:id", offerDelete);

module.exports = router;
