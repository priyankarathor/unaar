const Agencies = require("../model/Agencie");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// AWS config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim(),
});

const s3 = new AWS.S3();

// ADD AGENCY
exports.agenciesadd = async (req, res) => {
  try {
    const { link, agenciename, status } = req.body;

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Image is required",
      });
    }

    // Generate unique file name
    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;

    // S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    // Upload to S3
    const data = await s3.upload(params).promise();
    const imageUrl = data.Location; // Public URL from S3

    const newAgency = new Agencies({
      image: imageUrl, // Save S3 URL
      link,
      agenciename,
      status,
    });

    await newAgency.save();

    res.status(201).json({
      status: true,
      message: "Agency inserted successfully",
      data: newAgency,
    });
  } catch (error) {
    console.error("Error inserting agency:", error);
    res.status(500).json({
      status: false,
      message: "Failed to insert agency",
      error: error.message,
    });
  }
};

// GET ALL AGENCIES
exports.agenciesget = async (req, res) => {
  try {
    const agenciesList = await Agencies.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Agencies fetched successfully",
      data: agenciesList,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch Agencies",
      error: error.message,
    });
  }
};

// EDIT AGENCY
exports.agenciesedit = async (req, res) => {
  try {
    const { id } = req.params;
    const { link, agenciename, status } = req.body;

    const agency = await Agencies.findById(id);
    if (!agency) {
      return res.status(404).json({
        status: false,
        message: "Agency not found",
      });
    }

    // If new image is uploaded, send to S3
    if (req.file) {
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const data = await s3.upload(params).promise();
      agency.image = data.Location;
    }

    if (link) agency.link = link;
    if (agenciename) agency.agenciename = agenciename;
    if (status) agency.status = status;

    const updatedAgency = await agency.save();

    res.status(200).json({
      status: true,
      message: "Agency updated successfully",
      data: updatedAgency,
    });
  } catch (error) {
    console.error("Error updating agency:", error);
    res.status(500).json({
      status: false,
      message: "Failed to update agency",
      error: error.message,
    });
  }
};

// DELETE AGENCY
exports.agenciesdelete = async (req, res) => {
  try {
    const { id } = req.params;

    const agency = await Agencies.findByIdAndDelete(id);
    if (!agency) {
      return res.status(404).json({
        status: false,
        message: "Agency not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Agency deleted successfully",
      data: agency,
    });
  } catch (error) {
    console.error("Error deleting agency:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete agency",
      error: error.message,
    });
  }
};
