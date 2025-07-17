const express = require('express');
const router = express.Router();
const { bulkInsertProperties } = require('../controllers/csvController');

router.post('/bulkpropertyinsert', bulkInsertProperties);

module.exports = router;
