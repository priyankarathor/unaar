const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { mapAdd, mapGet, mapEdit, mapDelete } = require("../controllers/map1controller");

// Define your routes
router.post('/map1insert', upload.single('image'), mapAdd);
router.get('/map1getdata', mapGet);
router.put('/map1Edit/:id', upload.single('image'), mapEdit);
router.delete('/map1delete/:id', mapDelete);

module.exports = router;