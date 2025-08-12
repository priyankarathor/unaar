const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Offers = require("../model/Offersection");

// AWS S3 Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  region: process.env.AWS_REGION.trim(),
});
const s3 = new AWS.S3();

/**
 * Add a new offer
 */
exports.offerInsert = async (req, res) => {
  try {
    const { startdate, enddate, title, subtitle, buttonfirst, buttonseconed, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ status: false, message: "Image is required" });
    }

    // Upload image to S3
    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const uploadData = await s3.upload(params).promise();

    const newOffer = new Offers({
      image: uploadData.Location, // S3 URL
      imageType: req.file.mimetype,
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
    console.error("❌ Insert Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * Get all offers
 */
exports.offersGet = async (req, res) => {
  try {
    const offers = await Offers.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "✅ Offers fetched successfully",
      data: offers,
    });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * Edit an offer
 */
exports.offerEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { startdate, enddate, title, subtitle, buttonfirst, buttonseconed, link } = req.body;

    const offer = await Offers.findById(id);
    if (!offer) {
      return res.status(404).json({ status: false, message: "Offer not found" });
    }

    if (req.file) {
      // Upload new image to S3
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const uploadData = await s3.upload(params).promise();

      offer.image = uploadData.Location;
      offer.imageType = req.file.mimetype;
    }

    offer.startdate = startdate;
    offer.enddate = enddate;
    offer.title = title;
    offer.subtitle = subtitle;
    offer.buttonfirst = buttonfirst;
    offer.buttonseconed = buttonseconed;
    offer.link = link;

    const updatedOffer = await offer.save();

    res.status(200).json({
      status: true,
      message: "✅ Offer updated successfully",
      data: updatedOffer,
    });
  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * Delete an offer
 */
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
    console.error("❌ Delete Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};
