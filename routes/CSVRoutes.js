// routes/propertyRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { insertProperty } = require('../controllers/CSVController');

const upload = multer(); // using memory storage (for form fields only)

router.post('/propertyinsert', upload.none(), insertProperty);


module.exports = router;
