const express = require('express');
const router = express.Router();

const upload = require("../middleware/multer"); // Use same multer middleware as goldenvisa
const {
    offerInsert,
    offersGet,
    offerEdit,
    offerDelete
} = require("../controllers/offercontroller");

// Routes
router.post("/offerinsert", upload.single('image'), offerInsert);
router.get("/offerget", offersGet);
router.put("/offeredit/:id", upload.single('image'), offerEdit);
router.delete("/offerdelete/:id", offerDelete);

module.exports = router; // Always at the end
