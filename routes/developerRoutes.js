const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer()
const {
    developeradd,
    developerget,
    developeredit,
    developerdelete
} = require("../controllers/developerController");

router.post("/developerinsert", upload.single('image'), developeradd);
router.get("/developerget", developerget);
router.put("/developeredit/:id", upload.single('image'), developeredit);
router.delete("/developerdelete/:id", developerdelete);

module.exports = router;  // <-- Move this to the end
