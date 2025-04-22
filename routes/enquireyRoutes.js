const express = require("express");
const router = express.Router();
const { userEnquirey, userEnquireydata } = require('../controllers/userenquirey');

router.post("/enquireyenter", userEnquirey);
router.get("/enquireget", userEnquireydata);

module.exports = router;