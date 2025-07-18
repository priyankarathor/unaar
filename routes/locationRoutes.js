const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // Memory storage, handles text fields

const locationController = require('../controllers/locationController');

router.post('/locationinsert', upload.none(), locationController.locationInsert); // <-- Important
router.get('/locationall', locationController.locationsGet);
router.get('/locationtop', locationController.toplocations);
router.get('/countryTopLocation', locationController.toplocationsofcountry);
router.get('/toplocationsalldata', locationController.toplocationsall);
router.get('/alllocationfilter', locationController.locationsfilter);
router.delete('/locationDeleteData/:id', locationController.locationDelete);

//bulkfy
router.post('/bulkLocationInsertbulk', locationController.bulkLocationInsert);


module.exports = router;
