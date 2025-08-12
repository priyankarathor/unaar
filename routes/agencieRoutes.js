const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { agenciesAdd, agenciesGet, agenciesEdit, agenciesDelete } = require("../controllers/agencieController");

// Define your routes
router.post('/agencieinsert', upload.single('image'), agenciesAdd);
router.get('/agenciesgetdata', agenciesGet);
router.put('/agenciesEdit/:id', upload.single('image'), agenciesEdit);
router.delete('/agenciedelete/:id', agenciesDelete);

module.exports = router;