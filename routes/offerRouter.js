const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // in-memory storage

const offerController = require('../controllers/offercontroller');

router.post('/offerinsert', upload.single('image'), offerController.offerInsert);
router.get('/offerget', offerController.offersGet); // Returns offers + image buffer
router.put('/offeredit/:id', upload.single('image'), offerController.offerEdit);
router.delete('/offerdelete/:id', offerController.offerDelete);

module.exports = router;
