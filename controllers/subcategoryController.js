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
        let categories = req.body.categories;

        // If it's a single object, normalize to array
        if (!Array.isArray(categories)) {
            categories = [req.body];
        }

        // Normalize uploaded files (can be single or multiple)
        const uploadedFiles = req.files || (req.file ? [req.file] : []);

        const createdCategories = [];

        for (let i = 0; i < categories.length; i++) {
            const item = categories[i];
            let imageBuffer = null;
            let imageType = null;

            // Priority 1: Uploaded file (by index)
            if (uploadedFiles[i]) {
                imageBuffer = uploadedFiles[i].buffer;
                imageType = uploadedFiles[i].mimetype;
            }
            // Priority 2: Image URL
            else if (item.image && typeof item.image === 'string') {
                const response = await axios.get(item.image, { responseType: 'arraybuffer' });
                imageBuffer = Buffer.from(response.data, 'binary');
                imageType = response.headers['content-type'];
            }

            // If no image provided, throw error
            if (!imageBuffer || !imageType) {
                return res.status(400).json({
                    status: false,
                    message: `Image missing for category at index ${i}`
                });
            }

            const newCategory = new subCategory({
                image: imageBuffer,
                imageType,
                masterId: item.masterId,
                mastertitle: item.mastertitle,
                categorytype: item.categorytype,
                categoryvalue: item.categoryvalue,
                action: item.action
            });

            const savedCategory = await newCategory.save();
            createdCategories.push(savedCategory);
        }

        res.status(201).json({
            status: true,
            message: createdCategories.length > 1
                ? "Categories inserted successfully"
                : "Category inserted successfully",
            data: createdCategories
        });

    } catch (error) {
        console.error("Error inserting category:", error);
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
