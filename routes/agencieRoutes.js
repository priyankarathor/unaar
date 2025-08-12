const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = require("../middleware/multer");
const { agenciesadd, agenciesget, agenciesedit, agenciesdelete } = require("../controllers/agencieController");

// Define your routes
router.post('/agencieinsert', upload.single('image'), agenciesadd);
router.get('/agenciesgetdata', agenciesget);
router.put('/agenciesEdit/:id', upload.single('image'), agenciesedit);
router.delete('/agenciedelete/:id', agenciesdelete);

module.exports = router;