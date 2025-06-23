const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    propertyBannerAdd,
    propertyBannerGet,
    propertyBannerEdit,
    propertyBannerDelete
} = require("../controllers/propertybannerController");

router.post('/propertybannerinsert', upload.single('image'), propertyBannerAdd);
router.get('/propertybannergetdata', propertyBannerGet);
router.put('/propertybannerEdit/:id', upload.single('image'), propertyBannerEdit);
router.delete('/propertybannerdelete/:id', propertyBannerDelete);

module.exports = router;
