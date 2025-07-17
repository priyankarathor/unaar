// routes/csvRoutes.js
const express = require('express');
const router = express.Router();
const { bulkPropertyInsert } = require('../controllers/csvController');

router.post('/bulkpropertyinsert', bulkPropertyInsert);

module.exports = router;
