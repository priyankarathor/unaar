const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const GoldenVisa = require("../model/Goldenvisa");

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
 * Helper function to upload image to S3
 */
const uploadImageToS3 = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // Public S3 URL
};

/**
 * Add Golden Visa
 */
exports.goldenvisaadd = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImageToS3(req.file);
    }

    const newGoldenVisa = new GoldenVisa({
      imageUrl,
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      buttontitle: req.body.buttontitle,
      link: req.body.link,
    });

    await newGoldenVisa.save();

    res.status(201).json({
      status: true,
      message: "✅ Golden Visa saved successfully",
      data: newGoldenVisa,
    });
  } catch (error) {
    console.error("❌ Add Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * Get All Golden Visas
 */
exports.goldenvisaget = async (req, res) => {
  try {
    const goldenVisas = await GoldenVisa.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "✅ Golden Visas fetched successfully",
      data: goldenVisas,
    });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * Edit Golden Visa
 */
exports.goldenvisaedit = async (req, res) => {
  try {
    const { id } = req.params;
    const goldenVisa = await GoldenVisa.findById(id);

    if (!goldenVisa) {
      return res.status(404).json({ status: false, message: "Golden Visa not found" });
    }

    if (req.file) {
      goldenVisa.imageUrl = await uploadImageToS3(req.file);
    }

    goldenVisa.title = req.body.title || goldenVisa.title;
    goldenVisa.subtitle = req.body.subtitle || goldenVisa.subtitle;
    goldenVisa.description = req.body.description || goldenVisa.description;
    goldenVisa.buttontitle = req.body.buttontitle || goldenVisa.buttontitle;
    goldenVisa.link = req.body.link || goldenVisa.link;

    const updatedGoldenVisa = await goldenVisa.save();

    res.status(200).json({
      status: true,
      message: "✅ Golden Visa updated successfully",
      data: updatedGoldenVisa,
    });
  } catch (error) {
    console.error("❌ Edit Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * Delete Golden Visa
 */
exports.goldenvisadelete = async (req, res) => {
  try {
    const { id } = req.params;
    const goldenVisa = await GoldenVisa.findByIdAndDelete(id);

    if (!goldenVisa) {
      return res.status(404).json({ status: false, message: "Golden Visa not found" });
    }

    res.status(200).json({
      status: true,
      message: "✅ Golden Visa deleted successfully",
      data: goldenVisa,
    });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};
