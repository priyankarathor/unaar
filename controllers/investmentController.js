const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Investment = require("../model/Investment");

// AWS S3 Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  region: process.env.AWS_REGION.trim(),
});
const s3 = new AWS.S3();

/**
 * INSERT Investment
 */
exports.Investeradd = async (req, res) => {
  try {
    const { title, subtitle, description, buttontitle, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ status: false, message: "Image is required" });
    }

    // Upload to S3
    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const uploadData = await s3.upload(params).promise();

    const newInvestment = new Investment({
      image: uploadData.Location,
      imageType: req.file.mimetype,
      title,
      subtitle,
      description,
      buttontitle,
      date,
    });

    await newInvestment.save();

    res.status(201).json({
      status: true,
      message: "✅ Investment inserted successfully",
      data: newInvestment,
    });
  } catch (error) {
    console.error("❌ Insert Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * GET all Investments
 */
exports.InvestmentGet = async (req, res) => {
  try {
    const investments = await Investment.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "✅ Investments fetched successfully",
      data: investments,
    });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * EDIT Investment
 */
exports.InvestmentEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, buttontitle, date } = req.body;

    const investment = await Investment.findById(id);
    if (!investment) {
      return res.status(404).json({ status: false, message: "Investment not found" });
    }

    investment.title = title;
    investment.subtitle = subtitle;
    investment.description = description;
    investment.buttontitle = buttontitle;
    investment.date = date;

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

      investment.image = uploadData.Location;
      investment.imageType = req.file.mimetype;
    }

    const updatedInvestment = await investment.save();

    res.status(200).json({
      status: true,
      message: "✅ Investment updated successfully",
      data: updatedInvestment,
    });
  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * DELETE Investment
 */
exports.InvestmentDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findByIdAndDelete(id);
    if (!investment) {
      return res.status(404).json({ status: false, message: "Investment not found" });
    }

    res.status(200).json({
      status: true,
      message: "✅ Investment deleted successfully",
      data: investment,
    });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};
