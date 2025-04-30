const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // Using memoryStorage (default) for in-memory storage of files

const offerController = require('../controllers/offercontroller'); // Assuming controllers are in a separate file

// Routes to handle offers and images
router.post('/offerinsert', upload.single('image'), offerController.offerInsert);
router.get('/offerget', offerController.offersGet);
router.put('/offeredit/:id', upload.single('image'), offerController.offerEdit);
router.delete('/offerdelete/:id', offerController.offerDelete);
router.get('/offerimage/:id', offerController.getOfferImage);

module.exports = router;
