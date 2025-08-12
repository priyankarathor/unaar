// controllers/offercontroller.js
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Offers = require("../model/Offersection");

// AWS S3 config (ensure env vars are set)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim(),
});

const s3 = new AWS.S3();

const uploadImageToS3 = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};

exports.offerInsert = async (req, res) => {
  try {
    const { startdate, enddate, title, subtitle, buttonfirst, buttonseconed, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ status: false, message: "Image is required" });
    }

    const imageUrl = await uploadImageToS3(req.file);

    const newOffer = new Offers({
      image: imageUrl,
      startdate,
      enddate,
      title,
      subtitle,
      buttonfirst,
      buttonseconed,
      link,
    });

    await newOffer.save();

    return res.status(201).json({ status: true, message: "✅ Offer inserted successfully", data: newOffer });
  } catch (error) {
    console.error("❌ Error inserting offer:", error);
    return res.status(500).json({ status: false, message: "Failed to insert offer", error: error.message });
  }
};

exports.offersGet = async (req, res) => {
  try {
    const offers = await Offers.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: true, message: "✅ Offers fetched successfully", data: offers });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return res.status(500).json({ status: false, message: "Failed to fetch offers", error: error.message });
  }
};

exports.offerEdit = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Offer ID' });
    }

    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Update fields
    if (req.body.title) offer.title = req.body.title;
    if (req.body.description) offer.description = req.body.description;

    // Update image only if provided
    if (req.file) {
      offer.image.data = req.file.buffer;
      offer.image.contentType = req.file.mimetype;
    }

    await offer.save();
    res.status(200).json({ message: 'Offer updated successfully', offer });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.offerDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offers.findByIdAndDelete(id);
    if (!offer) return res.status(404).json({ status: false, message: "Offer not found" });

    return res.status(200).json({ status: true, message: "✅ Offer deleted successfully", data: offer });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return res.status(500).json({ status: false, message: "Failed to delete offer", error: error.message });
  }
};
