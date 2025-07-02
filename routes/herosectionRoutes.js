const express = require("express");
const router = express.Router();
const { herosectionadd, homesectionget, homesectionedit, homesectiondelete} = require('../controllers/herosectionController');

router.post("/homesectioninsert", herosectionadd);
router.get("/homesectionget", homesectionget);
router.put("/homesectionedit/:id", homesectionedit);
router.delete("/homesectiondel/:id", homesectiondelete);

module.exports = router;