const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
    Investeradd,
    InvestmentGet,
    InvestmentEdit,
    InvestmentDelete,
    getInvestmentImage
} = require("../controllers/investmentController");

router.post("/investment", upload.single('image'), Investeradd);
router.get("/investments", InvestmentGet);
router.put("/investmentedit/:id", upload.single('image'), InvestmentEdit);
router.delete("/investment/:id", InvestmentDelete);
router.get("/investment/image/:id", getInvestmentImage);

module.exports = router;
