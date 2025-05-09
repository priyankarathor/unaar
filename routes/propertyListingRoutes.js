const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/propertyinsert', upload.any(), async (req, res) => {
  try {
    const data = new PropertyListing({
      ...req.body,
      facilitieimage: req.files.find(f => f.fieldname === 'facilitieimage')?.buffer,
      featureimage: req.files.find(f => f.fieldname === 'featureimage')?.buffer,
      image: req.files.find(f => f.fieldname === 'image')?.buffer,
      remotelocationimage: req.files.find(f => f.fieldname === 'remotelocationimage')?.buffer,
    });
    await data.save();
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Insertion failed' });
  }
});
