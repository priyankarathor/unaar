const express = require("express");
const router = express.Router();
const { homelayoutadd, homelayoutget, homelayoutedit, homelayoutdelete} = require('../controllers/homelayoutController');

router.post("/homelayoutinsert", homelayoutadd);
router.get("/homelayoutget", homelayoutget);
router.put("/homelayoutedit/:id", homelayoutedit);
router.delete("/homelayoutdel/:id", homelayoutdelete);

module.exports = router;