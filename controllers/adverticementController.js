const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Advertisement = require("../model/adverticement");

// AWS S3 Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  region: process.env.AWS_REGION.trim(),
});
const s3 = new AWS.S3();

/**
 * ADD Advertisement
 */
exports.advertisementAdd = async (req, res) => {
  try {
    const { description, status } = req.body;

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Image is required",
      });
    }

    // Upload image to AWS S3
    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const uploadData = await s3.upload(params).promise();

    const newAdvertisement = new Advertisement({
      image: uploadData.Location, // S3 URL
      imageType: req.file.mimetype,
      description,
      status,
    });

    await newAdvertisement.save();

    res.status(201).json({
      status: true,
      message: "✅ Advertisement inserted successfully",
      data: newAdvertisement,
    });
  } catch (error) {
    console.error("❌ Error inserting advertisement:", error);
    res.status(500).json({
      status: false,
      message: "Failed to insert advertisement",
      error: error.message,
    });
  }
};

/**
 * GET All Advertisements
 */
exports.advertisementGet = async (req, res) => {
  try {
    const advertisements = await Advertisement.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "✅ Advertisements fetched successfully",
      data: advertisements,
    });
  } catch (error) {
    console.error("❌ Error fetching advertisements:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch advertisements",
      error: error.message,
    });
  }
};

/**
 * EDIT Advertisement
 */
exports.advertisementEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status } = req.body;

    const advertisement = await Advertisement.findById(id);
    if (!advertisement) {
      return res.status(404).json({
        status: false,
        message: "Advertisement not found",
      });
    }

    advertisement.description = description || advertisement.description;
    advertisement.status = status || advertisement.status;

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

      advertisement.image = uploadData.Location;
      advertisement.imageType = req.file.mimetype;
    }

    const updatedAd = await advertisement.save();

    res.status(200).json({
      status: true,
      message: "✅ Advertisement updated successfully",
      data: updatedAd,
    });
  } catch (error) {
    console.error("❌ Error updating advertisement:", error);
    res.status(500).json({
      status: false,
      message: "Failed to update advertisement",
      error: error.message,
    });
  }
};

/**
 * DELETE Advertisement
 */
exports.advertisementDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAd = await Advertisement.findByIdAndDelete(id);
    if (!deletedAd) {
      return res.status(404).json({
        status: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "✅ Advertisement deleted successfully",
      data: deletedAd,
    });
  } catch (error) {
    console.error("❌ Error deleting advertisement:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete advertisement",
      error: error.message,
    });
  }
};
