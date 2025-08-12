const Blog = require("../model/Blog");
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

// ===================== ADD Blog =====================
exports.blogadd = async (req, res) => {
  try {
    const {
      title, subtitle, description,
      categorylable, categoryValue, categoryType,
      action, date, categorytitle, authername,
      metatitle, metadescription, metakeyword
    } = req.body;

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

    const newBlog = new Blog({
      image: uploadResult.Location, // S3 URL
      title,
      subtitle,
      description,
      categorylable,
      categoryValue,
      categoryType,
      action,
      date,
      categorytitle,
      authername,
      metatitle,
      metadescription,
      metakeyword
    });

    await newBlog.save();

    res.status(201).json({
      status: true,
      message: "Blog saved successfully",
      data: newBlog
    });
  } catch (error) {
    console.error("Blog add error:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message
    });
  }
};

// ===================== GET all blogs =====================
exports.blogget = async (req, res) => {
  try {
    const blogData = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "Blogs fetched successfully",
      data: blogData
    });
  } catch (error) {
    console.error('Fetch blogs error:', error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch blogs: " + error.message
    });
  }
};

// ===================== EDIT Blog =====================
exports.blogedit = async (req, res) => {
  try {
    const { id } = req.params;

    const blogData = await Blog.findById(id);
    if (!blogData) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    const fieldsToUpdate = [
      "title", "subtitle", "description",
      "categorylable", "categoryValue", "categoryType",
      "action", "date", "categorytitle", "authername",
      "metatitle", "metadescription", "metakeyword", "status"
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        blogData[field] = req.body[field];
      }
    });

    // If new image uploaded, send to S3
    if (req.file) {
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const uploadResult = await s3.upload(params).promise();
      blogData.image = uploadResult.Location;
    }

    const updatedBlog = await blogData.save();

    res.status(200).json({
      status: true,
      message: "Blog updated successfully",
      data: updatedBlog
    });
  } catch (error) {
    console.error("Blog edit error:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message
    });
  }
};

// ===================== DELETE Blog =====================
exports.blogdelete = async (req, res) => {
  try {
    const { id } = req.params;

    const blogData = await Blog.findByIdAndDelete(id);
    if (!blogData) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    res.status(200).json({
      status: true,
      message: "Blog deleted successfully",
      data: blogData
    });
  } catch (error) {
    console.error("Blog delete error:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong: " + error.message
    });
  }
};
