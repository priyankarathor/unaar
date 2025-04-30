const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offercontroller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/offerinsert', upload.single('image'), offerController.offerInsert);
router.get('/offerget', offerController.offersGet);
router.put('/offeredit/:id', upload.single('image'), offerController.offerEdit);
router.delete('/offerdelete/:id', offerController.offerDelete);
router.get('/offerimage/:id', offerController.getOfferImage); // Serve image by ID

module.exports = router;
