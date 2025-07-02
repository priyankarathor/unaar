const express = require("express");
const router = express.Router();
const { addMap2Section, getMap2Sections, updateMap2Section, deleteMap2Section} = require('../controllers/map2CardController');

router.post("/Map2Sectioninsert", addMap2Section);
router.get("/Map2Sectionsget", getMap2Sections);
router.put("/Map2Sectionsedit/:id", updateMap2Section);
router.delete("/Map2Sectiondel/:id", deleteMap2Section);

module.exports = router;