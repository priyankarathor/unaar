const Agencies = require("../model/Agencie");
const AWS = require("aws-sdk");

// AWS config (only if needed for S3 usage later)
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

    const newAgency = new Agencies({
      image: req.file.buffer, // Store image as buffer
      imageType: req.file.mimetype,
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

    const agenciesListWithImage = agenciesList.map((agency) => ({
      _id: agency._id,
      image: agency.image
        ? `data:${agency.imageType || "image/png"};base64,${agency.image.toString("base64")}`
        : null,
      link: agency.link,
      agenciename: agency.agenciename,
      status: agency.status,
    }));

    res.status(200).json({
      status: true,
      message: "Agencies fetched successfully",
      data: agenciesListWithImage,
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

    if (req.file) {
      agency.image = req.file.buffer;
      agency.imageType = req.file.mimetype;
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
