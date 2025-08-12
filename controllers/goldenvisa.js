const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const GoldenVisa = require("../model/Goldenvisa");

// AWS Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  region: process.env.AWS_REGION.trim(),
});

const s3 = new AWS.S3();

/**
 * Add Golden Visa
 */
exports.goldenvisaadd = async (req, res) => {
  try {
    let imageUrl = null;

    //golden visa upload
    // Upload image if provided
    if (req.file) {
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      imageUrl = uploadResult.Location;
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
      message: "✅ Golden Visa fetched successfully",
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

    // Upload new image if provided
    if (req.file) {
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      goldenVisa.imageUrl = uploadResult.Location;
    }

    goldenVisa.title = req.body.title;
    goldenVisa.subtitle = req.body.subtitle;
    goldenVisa.description = req.body.description;
    goldenVisa.buttontitle = req.body.buttontitle;
    goldenVisa.link = req.body.link;

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
