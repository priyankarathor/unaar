const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // No diskStorage — using memoryStorage (default)

const offerController = require('../controllers/offerController');

router.post('/offerinsert', upload.single('image'), offerController.offerInsert);
router.get('/offerget', offerController.offersGet);
router.put('/offeredit/:id', upload.single('image'), offerController.offerEdit);
router.delete('/offerdelete/:id', offerController.offerDelete);
router.get('/offerimage/:id', offerController.getOfferImage);

module.exports = router;

