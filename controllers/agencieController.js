const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Agencies = require("../model/Agencie");

// AWS Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim(),
});

const s3 = new AWS.S3();

// Upload helper
const uploadToS3 = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const data = await s3.upload(params).promise();
  return data.Location;
};

// ADD AGENCY
exports.agenciesAdd = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    } else {
      return res.status(400).json({
        status: false,
        message: "Image is required",
      });
    }

    const agency = new Agencies({
      image: imageUrl,
      link: req.body.link,
      agenciename: req.body.agenciename,
      status: req.body.status,
    });

    await agency.save();
    res.status(201).json({
      status: true,
      message: "✅ Agency added successfully",
      data: agency,
    });
  } catch (error) {
    console.error("❌ Add Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// GET ALL AGENCIES
exports.agenciesGet = async (req, res) => {
  try {
    const agenciesList = await Agencies.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "Agencies fetched successfully",
      data: agenciesList,
    });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// EDIT AGENCY
exports.agenciesEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const agency = await Agencies.findById(id);

    if (!agency) {
      return res.status(404).json({
        status: false,
        message: "Agency not found",
      });
    }

    if (req.file) {
      agency.image = await uploadToS3(req.file);
    }
    if (req.body.link) agency.link = req.body.link;
    if (req.body.agenciename) agency.agenciename = req.body.agenciename;
    if (req.body.status) agency.status = req.body.status;

    await agency.save();
    res.status(200).json({
      status: true,
      message: "✅ Agency updated successfully",
      data: agency,
    });
  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// DELETE AGENCY
exports.agenciesDelete = async (req, res) => {
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
      message: "✅ Agency deleted successfully",
      data: agency,
    });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};
