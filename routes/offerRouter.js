// routes/offer.js
const express = require('express');
const router = express.Router();

const upload = require("../middleware/multer");
const offerController = require("../controllers/offercontroller");

router.post('/offerinsert', upload.single('image'), offerController.offerInsert);
router.get('/offerget', offerController.offersGet);
router.put('/offeredit/:id', upload.single('image'), offerController.offerEdit);
router.delete('/offerdelete/:id', offerController.offerDelete);

module.exports = router;
