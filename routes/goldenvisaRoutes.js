const express = require("express");
const router = express.Router();
const { goldenvisaadd, goldenvisaget, goldenvisaedit,goldenvisadelete } = require('../controllers/goldenvisa');

router.post("/goldenvisainsert", goldenvisaadd);
router.get("/goldenvisaget", goldenvisaget);
router.put("/goldenvisaedit/:id", goldenvisaedit);
router.delete("/deletegoldenvisa/:id", goldenvisadelete); 

module.exports = router;
