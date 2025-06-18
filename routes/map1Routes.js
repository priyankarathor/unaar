const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  mapAdd,
  mapGet,
  mapEdit,
  mapDelete,
  updateStatus,
  mapGetActive
} = require('../controllers/map1controller');

router.post('/map1insert', upload.single('image'), mapAdd);
router.get('/map1getdata', mapGet);
router.get('/map1getActive', mapGetActive);
router.put('/map1Edit/:id', upload.single('image'), mapEdit);
router.delete('/map1delete/:id', mapDelete);

router.put('/updatestatus/:id', updateStatus);

module.exports = router;
