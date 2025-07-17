const express = require('express');
const multer = require('multer');
const { bulkInsertProperties } = require('../controllers/CSVController');

const router = express.Router();
const upload = multer(); // for form-data without file

router.post('/bulkpropertyinsert', upload.none(), bulkInsertProperties);

module.exports = router;
