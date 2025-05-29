const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.post('/locationinsert', locationController.locationInsert);
router.get('/locationall', locationController.locationsGet);

module.exports = router;
