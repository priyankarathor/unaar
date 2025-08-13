const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const mongoose = require("mongoose");
const Category = require("../model/category");

// AWS S3 Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim(),
});

const s3 = new AWS.S3();

// Upload to S3 function
const uploadImageToS3 = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};

// INSERT CATEGORY
exports.categoryInsert = async (req, res) => {
  try {
    const { categorytype, categoryvalue, action } = req.body;

    if (!req.file) {
      return res.status(400).json({ status: false, message: "Image is required" });
    }

    const imageUrl = await uploadImageToS3(req.file);

    const newCategory = new Category({
      categorytype,
      categoryvalue,
      action,
      image: imageUrl,
    });

    await newCategory.save();

    res.status(201).json({
      status: true,
      message: "✅ Category inserted successfully",
      data: newCategory
    });
  } catch (error) {
    console.error("❌ Error inserting category:", error);
    res.status(500).json({ status: false, message: "Failed to insert category", error: error.message });
  }
};

// GET ALL CATEGORIES
exports.categoryGet = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "✅ Categories fetched successfully",
      data: categories
    });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ status: false, message: "Failed to fetch categories", error: error.message });
  }
};

// EDIT CATEGORY
exports.categoryEdit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid Category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    if (req.file) {
      category.image = await uploadImageToS3(req.file);
    }

    category.categorytype = req.body.categorytype || category.categorytype;
    category.categoryvalue = req.body.categoryvalue || category.categoryvalue;
    category.action = req.body.action || category.action;

    const updatedCategory = await category.save();

    res.status(200).json({
      status: true,
      message: "✅ Category updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    res.status(500).json({ status: false, message: "Failed to update category", error: error.message });
  }
};

// DELETE CATEGORY
exports.categoryDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid Category ID" });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ status: false, message: "Category not found" });
    }

    res.status(200).json({
      status: true,
      message: "✅ Category deleted successfully",
      data: category
    });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    res.status(500).json({ status: false, message: "Failed to delete category", error: error.message });
  }
};
