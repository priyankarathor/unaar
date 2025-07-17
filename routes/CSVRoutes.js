// routes/propertyRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { insertProperty } = require('../controllers/CSVController');

const upload = multer(); // using memory storage (for form fields only)
//CSV BULK
router.post('/bulkpropertyinsert', upload.none(), propertylistingController.bulkInsertProperties);
module.exports = router;
