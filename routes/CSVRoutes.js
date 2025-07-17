const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csvtojson');
const { downloadCsvTemplate, bulkInsertFromCSV } = require('../controllers/CSVController');

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to download empty CSV template
router.get('/template', downloadCsvTemplate);

// Route to handle bulk CSV upload and insert
router.post('/bulkpropertyinsert', upload.single('file'), bulkInsertFromCSV);

module.exports = router;
