const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Map1 = require("../model/map");

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  region: process.env.AWS_REGION.trim(),
});

const s3 = new AWS.S3();

/**
 * Upload File to AWS S3
 */
const uploadToS3 = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  return await s3.upload(params).promise();
};

/**
 * Add Map
 */
exports.mapAdd = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const uploadData = await uploadToS3(req.file);

    const newMap = new Map1({
      image: uploadData.Location, // S3 public URL
      imageType: req.file.mimetype,
    });

    await newMap.save();

    res.status(201).json({ message: "Inserted successfully", data: newMap });
  } catch (err) {
    console.error("Add Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Get All Maps
 */
exports.mapGet = async (req, res) => {
  try {
    const data = await Map1.find().sort({ createdAt: -1 });
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

/**
 * Get Only Active Maps
 */
exports.mapGetActive = async (req, res) => {
  try {
    const data = await Map1.find({ status: "Active" });
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

/**
 * Edit Map
 */
exports.mapEdit = async (req, res) => {
  try {
    const updateData = {};

    if (req.file) {
      const uploadData = await uploadToS3(req.file);
      updateData.image = uploadData.Location;
      updateData.imageType = req.file.mimetype;
    }

    const updatedMap = await Map1.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedMap) {
      return res.status(404).json({ message: "Map not found" });
    }

    res.status(200).json({ message: "Updated successfully", data: updatedMap });
  } catch (err) {
    res.status(500).json({ message: "Update error", error: err.message });
  }
};

/**
 * Delete Map
 */
exports.mapDelete = async (req, res) => {
  try {
    const deleted = await Map1.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Map not found" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err.message });
  }
};

/**
 * Update Status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Map1.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Map not found" });
    }

    res.status(200).json({ message: "Status updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Status update failed", error: err.message });
  }
};
