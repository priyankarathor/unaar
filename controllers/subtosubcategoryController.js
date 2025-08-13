const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const subtosubsubCategory = require("../model/SubtoSubCategory");
//ok
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
    return data.Location; // S3 file URL
};

/**
 * INSERT CATEGORY
 */
exports.subtosubcategoryInsert = async (req, res) => {
    try {
        const { masterId, subcategoryId, mastertitle, subtitle, categorytype, categoryvalue, action } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: false, message: "Image is required" });
        }

        const imageUrl = await uploadToS3(req.file);

        const newCategory = new subtosubsubCategory({
            image: imageUrl,
            masterId,
            subcategoryId,
            mastertitle,
            subtitle,
            categorytype,
            categoryvalue,
            action
        });

        await newCategory.save();

        res.status(201).json({
            status: true,
            message: "✅ Category inserted successfully",
            data: newCategory
        });
    } catch (error) {
        console.error("❌ Insert Error:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * GET ALL CATEGORIES
 */
exports.subtosubcategoryGet = async (req, res) => {
    try {
        const categories = await subtosubsubCategory.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            message: "✅ Categories fetched successfully",
            data: categories,
        });
    } catch (error) {
        console.error("❌ Fetch Error:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * EDIT CATEGORY
 */
exports.subtosubcategoryEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { masterId, subcategoryId, mastertitle, subtitle, categorytype, categoryvalue, action } = req.body;

        const category = await subtosubsubCategory.findById(id);
        if (!category) {
            return res.status(404).json({ status: false, message: "Category not found" });
        }

        if (req.file) {
            const imageUrl = await uploadToS3(req.file);
            category.image = imageUrl;
        }

        category.masterId = masterId;
        category.subcategoryId = subcategoryId;
        category.mastertitle = mastertitle;
        category.subtitle = subtitle;
        category.categorytype = categorytype;
        category.categoryvalue = categoryvalue;
        category.action = action;

        const updatedCategory = await category.save();

        res.status(200).json({
            status: true,
            message: "✅ Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        console.error("❌ Update Error:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * DELETE CATEGORY
 */
exports.subtosubcategoryDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await subtosubsubCategory.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ status: false, message: "Category not found" });
        }

        res.status(200).json({
            status: true,
            message: "✅ Category deleted successfully",
            data: category
        });
    } catch (error) {
        console.error("❌ Delete Error:", error);
        res.status(500).json({ status: false, message: error.message });
    }
};
