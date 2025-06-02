const express = require("express");
const router = express.Router();
const { profilelayoutadd, profilelayoutget, profilelayoutedit, profilelayoutdelete} = require('../controllers/profileController');

router.post("/profilelayoutinsert", profilelayoutadd);
router.get("/profilelayoutget", profilelayoutget);
router.put("/profilelayoutedit/:id", profilelayoutedit);
router.delete("/profilelayoutdel/:id", profilelayoutdelete);

module.exports = router;