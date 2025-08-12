const express = require('express');
const router = express.Router();

const upload = require("../middleware/multer");
const {
    goldenvisaadd,
    goldenvisaget,
    goldenvisaedit,
    goldenvisadelete
} = require("../controllers/goldenvisa");

router.post("/goldenvisainsert", upload.single('image'), goldenvisaadd);
router.get("/goldenvisaget", goldenvisaget);
router.put("/goldenvisaedit/:id", upload.single('image'), goldenvisaedit);
router.delete("/goldenvisadelete/:id", goldenvisadelete);

module.exports = router;
