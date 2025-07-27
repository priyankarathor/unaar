const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require("../middleware/multer");
const {
    developerAdd,
    developerGet,
    developerEdit,
    developerDelete
} = require("../controllers/developerController");

router.post("/developerinsert", upload.single('image'), developerAdd);
router.get("/developerget", developerGet);
router.put("/developeredit/:id", upload.single('image'), developerEdit);
router.delete("/developerdelete/:id", developerDelete);

module.exports = router;  // <-- Move this to the end
