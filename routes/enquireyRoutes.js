const express = require("express");
const router = express.Router();
const { userEnquirey, userEnquireydata, userEnquireyDelete } = require('../controllers/userenquirey');

router.post("/enquireyenter", userEnquirey);
router.get("/enquireget", userEnquireydata);
router.delete("/deleteinquire/:id", userEnquireyDelete); 
module.exports = router;
