const Developer = require("../model/Developer");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// AWS S3 Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  region: process.env.AWS_REGION.trim(),
});
const s3 = new AWS.S3();

// ===================== ADD Developer =====================
exports.developerAdd = async (req, res) => {
  try {
    const { farmname, title, About, year, otherdetails, History } = req.body;

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
    const uploadResult = await s3.upload(params).promise();

    const newDeveloper = new Developer({
      farmname,
      title,
      About,
      year,
      otherdetails,
      History,
      image: uploadResult.Location // Store S3 URL
    });

    await newDeveloper.save();

    res.status(201).json({
      status: true,
      message: "Developer added successfully",
      data: newDeveloper,
    });
  } catch (error) {
    console.error("Error adding developer:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error: " + error.message,
    });
  }
};

// ===================== GET All Developers =====================
exports.developerGet = async (req, res) => {
  try {
    const developers = await Developer.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "Developers fetched successfully",
      data: developers,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch developers: " + error.message,
    });
  }
};

// ===================== EDIT Developer =====================
exports.developerEdit = async (req, res) => {
  try {
    const { farmname, title, About, year, otherdetails, History } = req.body;
    const { id } = req.params;

    const developer = await Developer.findById(id);
    if (!developer) {
      return res.status(404).json({ status: false, message: "Developer not found" });
    }

    developer.farmname = farmname;
    developer.title = title;
    developer.About = About;
    developer.year = year;
    developer.otherdetails = otherdetails;
    developer.History = History;

    // If new image uploaded, upload to S3
    if (req.file) {
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const uploadResult = await s3.upload(params).promise();
      developer.image = uploadResult.Location;
    }

    const updatedDeveloper = await developer.save();

    res.status(200).json({
      status: true,
      message: "Developer updated successfully",
      data: updatedDeveloper,
    });
  } catch (error) {
    console.error("Error updating developer:", error);
    res.status(400).json({
      status: false,
      message: "Error updating developer: " + error.message,
    });
  }
};

// ===================== DELETE Developer =====================
exports.developerDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const developer = await Developer.findByIdAndDelete(id);
    if (!developer) {
      return res.status(404).json({
        status: false,
        message: "Developer not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Developer deleted successfully",
      data: developer,
    });
  } catch (error) {
    console.error("Error deleting developer:", error);
    res.status(500).json({
      status: false,
      message: "Error deleting developer: " + error.message,
    });
  }
};
