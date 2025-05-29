const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // Memory storage, handles text fields

const locationController = require('../controllers/locationController');

router.post('/locationinsert', upload.none(), locationController.locationInsert); // <-- Important
router.get('/locationall', locationController.locationsGet);

module.exports = router;
