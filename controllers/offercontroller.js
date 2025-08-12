// controllers/offersection.js
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Offers = require("../model/Offersection");

// =========================
// AWS S3 Configuration
// =========================
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim(),
});

const s3 = new AWS.S3();

/**
 * Upload file to AWS S3
 */
const uploadImageToS3 = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Makes file publicly accessible
  };

  const result = await s3.upload(params).promise();
  return result.Location; // S3 URL
};

// =========================
// Insert a new offer
// =========================
exports.offerInsert = async (req, res) => {
  try {
    const { startdate, enddate, title, subtitle, buttonfirst, buttonseconed, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ status: false, message: "Image is required" });
    }

    // Upload image to AWS S3
    const imageUrl = await uploadImageToS3(req.file);

    const newOffer = new Offers({
      imageUrl, // store URL instead of buffer
      startdate,
      enddate,
      title,
      subtitle,
      buttonfirst,
      buttonseconed,
      link,
    });

    await newOffer.save();

    res.status(201).json({
      status: true,
      message: "✅ Offer inserted successfully",
      data: newOffer,
    });
  } catch (error) {
    console.error("❌ Error inserting offer:", error);
    res.status(500).json({
      status: false,
      message: "Failed to insert offer",
      error: error.message,
    });
  }
};

// =========================
// Get all offers
// =========================
exports.offersGet = async (req, res) => {
  try {
    const offers = await Offers.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "✅ Offers fetched successfully",
      data: offers,
    });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch offers",
      error: error.message,
    });
  }
};

// =========================
// Edit an offer
// =========================
exports.offerEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { startdate, enddate, title, subtitle, buttonfirst, buttonseconed, link } = req.body;

    const offer = await Offers.findById(id);
    if (!offer) {
      return res.status(404).json({ status: false, message: "Offer not found" });
    }

    if (req.file) {
      // Upload new image to AWS S3
      offer.imageUrl = await uploadImageToS3(req.file);
    }

    offer.startdate = startdate || offer.startdate;
    offer.enddate = enddate || offer.enddate;
    offer.title = title || offer.title;
    offer.subtitle = subtitle || offer.subtitle;
    offer.buttonfirst = buttonfirst || offer.buttonfirst;
    offer.buttonseconed = buttonseconed || offer.buttonseconed;
    offer.link = link || offer.link;

    const updatedOffer = await offer.save();

    res.status(200).json({
      status: true,
      message: "✅ Offer updated successfully",
      data: updatedOffer,
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to update offer",
      error: error.message,
    });
  }
};

// =========================
// Delete an offer
// =========================
exports.offerDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offers.findByIdAndDelete(id);
    if (!offer) {
      return res.status(404).json({ status: false, message: "Offer not found" });
    }

    res.status(200).json({
      status: true,
      message: "✅ Offer deleted successfully",
      data: offer,
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete offer",
      error: error.message,
    });
  }
};
