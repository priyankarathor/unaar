const axios = require("axios");
const subCategory = require("../model/SubCategory");

// Utility function to get image content-type from extension
const getContentType = (filenameOrType) => {
    const extensionMap = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        webp: 'image/webp',
        bmp: 'image/bmp',
        tiff: 'image/tiff',
        ico: 'image/x-icon',
    };

    const ext = (filenameOrType || '').split('.').pop().toLowerCase();
    return extensionMap[ext] || 'application/octet-stream';
};

// INSERT SUBCATEGORY
exports.subcategoryInsert = async (req, res) => {
    try {
        const { masterId, mastertitle, categorytype, categoryvalue, action, image } = req.body;

        let imageBuffer, imageType;

        // Case 1: File uploaded via form
        if (req.file) {
            imageBuffer = req.file.buffer;
            imageType = req.file.mimetype;
        }
        // Case 2: Image provided via URL in JSON body
        else if (image && typeof image === 'string') {
            const response = await axios.get(image, { responseType: 'arraybuffer' });
            imageBuffer = Buffer.from(response.data, 'binary');
            imageType = response.headers['content-type'];
        } else {
            return res.status(400).json({
                status: false,
                message: "Image is required (upload or provide image URL)"
            });
        }

        const newCategory = new subCategory({
            image: imageBuffer,
            imageType,
            masterId,
            mastertitle,
            categorytype,
            categoryvalue,
            action
        });

        await newCategory.save();

        res.status(201).json({
            status: true,
            message: "Category inserted successfully",
            data: newCategory
        });

    } catch (error) {
        console.error('Error inserting category:', error);
        res.status(500).json({
            status: false,
            message: "Failed to insert category",
            error: error.message
        });
    }
};

// GET ALL SUBCATEGORIES
exports.subcategoryGet = async (req, res) => {
    try {
        const categories = await subCategory.find().sort({ createdAt: -1 });

        const categoriesWithImage = categories.map(category => ({
            _id: category._id,
            masterId: category.masterId,
            mastertitle: category.mastertitle,
            categorytype: category.categorytype,
            categoryvalue: category.categoryvalue,
            action: category.action,
            image: category.image ? {
                data: category.image,
                contentType: getContentType(category.imageType || 'jpg')
            } : null
        }));

        res.status(200).json({
            status: true,
            message: "Categories fetched successfully",
            data: categoriesWithImage
        });
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};

// EDIT SUBCATEGORY
exports.subcategoryEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { masterId, mastertitle, categorytype, categoryvalue, action, image } = req.body;

        const category = await subCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        // Update image if new one is uploaded
        if (req.file) {
            category.image = req.file.buffer;
            category.imageType = req.file.mimetype;
        } else if (image && typeof image === 'string') {
            const response = await axios.get(image, { responseType: 'arraybuffer' });
            category.image = Buffer.from(response.data, 'binary');
            category.imageType = response.headers['content-type'];
        }

        // Update other fields
        category.masterId = masterId;
        category.mastertitle = mastertitle;
        category.categorytype = categorytype;
        category.categoryvalue = categoryvalue;
        category.action = action;

        const updatedCategory = await category.save();

        res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: updatedCategory
        });

    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            status: false,
            message: "Failed to update category",
            error: error.message
        });
    }
};

// DELETE SUBCATEGORY
exports.subcategoryDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await subCategory.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Category deleted successfully",
            data: category
        });

    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            status: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};
