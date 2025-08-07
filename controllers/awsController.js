const upload = require('../middleware/multer');

const uploadToAws = (req, res) => {
  const uploader = upload.array('s3Image', 2); // up to 2 files

  uploader(req, res, function (err) {
    if (err) {
      console.error('S3 upload error:', err);
      return res.status(500).json({ msg: 'Error occurred while uploading', err });
    }

    return res.status(200).json({
      msg: 'Files uploaded successfully',
      files: req.files
    });
  });
};

module.exports = { uploadToAws };
