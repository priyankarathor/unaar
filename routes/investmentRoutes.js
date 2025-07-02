const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
    Investeradd,
    InvestmentGet,
    InvestmentEdit,
    InvestmentDelete
} = require("../controllers/investmentController");

router.post("/investment", upload.single('image'), Investeradd);
router.get("/investments", InvestmentGet);
router.put("/investmentedit/:id", upload.single('image'), InvestmentEdit);
router.delete("/investment/:id", InvestmentDelete);

module.exports = router;
