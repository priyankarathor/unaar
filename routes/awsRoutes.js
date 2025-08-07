const express = require('express');
const router = express.Router();
const { uploadToAws } = require('../controllers/awsController');

router.post('/upload', uploadToAws);

module.exports = router;
