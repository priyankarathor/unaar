const express = require('express');
const router = express.Router();
const { bulkPropertyInsert } = require('../controllers/CSVController');

// POST: Bulk Property Insert
router.post('/bulkpropertyinsert', bulkPropertyInsert);

module.exports = router;