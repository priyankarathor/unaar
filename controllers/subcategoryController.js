const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const axios = require("axios");
const subCategory = require("../model/SubCategory");

// AWS Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim(),
});

const s3 = new AWS.S3();

/**
 * Upload file buffer to AWS S3
 */
const uploadToS3 = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const data = await s3.upload(params).promise();
  return data.Location; // returns file URL
};

/**
 * Download image from URL and return buffer + mimetype
 */
const downloadImageToBuffer = async (url) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const contentType = response.headers["content-type"];
  const buffer = Buffer.from(response.data, "binary");
  const originalname = path.basename(url);
  return { buffer, contentType, originalname };
};

/**
 * Insert single subcategory
 */
exports.subcategoryInsert = async (req, res) => {
  try {
    const { masterId, mastertitle, categorytype, categoryvalue, action } = req.body;

    if (!req.file) {
      return res.status(400).json({ status: false, message: "Image is required" });
    }

    const imageUrl = await uploadToS3(req.file);

    const newSubCategory = new subCategory({
      masterId,
      mastertitle,
      categorytype,
      categoryvalue,
      action,
      image: imageUrl,
    });

    await newSubCategory.save();
    res.status(201).json({
      status: true,
      message: "✅ Subcategory inserted successfully",
      data: newSubCategory,
    });
  } catch (error) {
    console.error("❌ Insert Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * Bulk insert subcategories
 */
exports.subcategoryBulkInsert = async (req, res) => {
  try {
    const categories = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ status: false, message: "Array of categories required" });
    }

    const insertedCategories = [];
    const errors = [];

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      let { masterId, mastertitle = "", categorytype, categoryvalue, action, image } = cat;

      if (!categorytype || !categoryvalue) {
        errors.push({ index: i, message: "categorytype and categoryvalue are required" });
        continue;
      }

      if (!image) {
        errors.push({ index: i, message: "Image is required" });
        continue;
      }

      try {
        let imageUrl;

        if (image.startsWith("http://") || image.startsWith("https://")) {
          // Download image from URL and upload to S3
          const { buffer, contentType, originalname } = await downloadImageToBuffer(image);
          const file = { buffer, mimetype: contentType, originalname };
          imageUrl = await uploadToS3(file);
        } else {
          errors.push({ index: i, message: "Only image URLs are supported in bulk insert" });
          continue;
        }

        const newSubCategory = new subCategory({
          masterId: masterId?.trim(),
          mastertitle: mastertitle.trim(),
          categorytype: categorytype.trim(),
          categoryvalue: categoryvalue.trim(),
          action: action?.trim(),
          image: imageUrl,
        });

        await newSubCategory.save();
        insertedCategories.push(newSubCategory);
      } catch (err) {
        errors.push({ index: i, message: "Error inserting category: " + err.message });
      }
    }

    res.status(insertedCategories.length > 0 ? 201 : 400).json({
      status: insertedCategories.length > 0,
      message:
        insertedCategories.length > 0
          ? "✅ Categories inserted successfully"
          : "❌ No categories inserted",
      insertedCount: insertedCategories.length,
      errors,
      data: insertedCategories,
    });
  } catch (error) {
    console.error("❌ Bulk Insert Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * Get all subcategories
 */
exports.subcategoryGet = async (req, res) => {
  try {
    const categories = await subCategory.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "✅ Subcategories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * Edit subcategory
 */
exports.subcategoryEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { masterId, mastertitle, categorytype, categoryvalue, action } = req.body;

    const category = await subCategory.findById(id);
    if (!category) {
      return res.status(404).json({ status: false, message: "Subcategory not found" });
    }

    if (req.file) {
      const imageUrl = await uploadToS3(req.file);
      category.image = imageUrl;
    }

    category.masterId = masterId;
    category.mastertitle = mastertitle;
    category.categorytype = categorytype;
    category.categoryvalue = categoryvalue;
    category.action = action;

    const updatedCategory = await category.save();

    res.status(200).json({
      status: true,
      message: "✅ Subcategory updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

/**
 * Delete subcategory
 */
exports.subcategoryDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await subCategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ status: false, message: "Subcategory not found" });
    }

    res.status(200).json({
      status: true,
      message: "✅ Subcategory deleted successfully",
      data: category,
    });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};
