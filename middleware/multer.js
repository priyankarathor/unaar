require('dotenv').config();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('../config/aws'); // use your config file

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "getstarting-s3-unaar-demostration01",
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const filename = Date.now().toString() + '-' + file.originalname;
      cb(null, filename);
    }
  })
});

module.exports = upload;
