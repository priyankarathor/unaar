// controllers/offercontroller.js
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const mongoose = require("mongoose");
const Offers = require("../model/Offersection");

// AWS S3 config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim(),
});

const s3 = new AWS.S3();

// Upload file to AWS S3
const uploadImageToS3 = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Make file publicly accessible
  };

  const result = await s3.upload(params).promise();
  return result.Location; // Return file URL
};

// =========================
// Insert Offer
// =========================
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

// =========================
// Get All Offers
// =========================
exports.offersGet = async (req, res) => {
  try {
    const offers = await Offers.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: true, message: "✅ Offers fetched successfully", data: offers });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return res.status(500).json({ status: false, message: "Failed to fetch offers", error: error.message });
  }
};

// =========================
// Edit Offer
// =========================
exports.offerEdit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid Offer ID" });
    }

    const offer = await Offers.findById(id);
    if (!offer) {
      return res.status(404).json({ status: false, message: "Offer not found" });
    }

    // Update image only if new file is provided
    if (req.file) {
      offer.image = await uploadImageToS3(req.file);
    }

    // Update other fields
    offer.startdate = req.body.startdate || offer.startdate;
    offer.enddate = req.body.enddate || offer.enddate;
    offer.title = req.body.title || offer.title;
    offer.subtitle = req.body.subtitle || offer.subtitle;
    offer.buttonfirst = req.body.buttonfirst || offer.buttonfirst;
    offer.buttonseconed = req.body.buttonseconed || offer.buttonseconed;
    offer.link = req.body.link || offer.link;

    await offer.save();

    return res.status(200).json({ status: true, message: "✅ Offer updated successfully", data: offer });
  } catch (error) {
    console.error("❌ Update error:", error);
    return res.status(500).json({ status: false, message: "Failed to update offer", error: error.message });
  }
};

// =========================
// Delete Offer
// =========================
exports.offerDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid Offer ID" });
    }

    const offer = await Offers.findByIdAndDelete(id);
    if (!offer) {
      return res.status(404).json({ status: false, message: "Offer not found" });
    }

    return res.status(200).json({ status: true, message: "✅ Offer deleted successfully", data: offer });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return res.status(500).json({ status: false, message: "Failed to delete offer", error: error.message });
  }
};
