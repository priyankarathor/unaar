const Category = require('../model/category');

// INSERT CATEGORY
exports.categoryInsert = async (req, res) => {
    try {
        const { categorytype, categoryvalue, action } = req.body;

        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ 
                status: false, 
                message: "Image is required" 
            });
        }

        // Create a new category with image buffer
        const newCategory = new Category({
            image: req.file.buffer,        // Store image as buffer
            imageType: req.file.mimetype,  // Store MIME type
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

// GET CATEGORIES AND IMAGE (optional based on categoryvalue query)
exports.categoryGet = async (req, res) => {
    try {
        const { categoryvalue } = req.query;

        // If categoryvalue is provided, return the image of that category
        if (categoryvalue) {
            const category = await Category.findOne({ categoryvalue });

            if (!category || !category.image) {
                return res.status(404).send('Image not found');
            }

            res.set('Content-Type', category.imageType || 'image/png');
            return res.send(category.image); // Sends the binary image data
        }

        // If categoryvalue is not provided, return all categories
        const categories = await Category.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            message: "Categories fetched successfully",
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories or image:', error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch categories or image",
            error: error.message
        });
    }
};

// EDIT CATEGORY
exports.categoryEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { categorytype, categoryvalue, action } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        // If a new image is uploaded, update it
        if (req.file) {
            category.image = req.file.buffer;
            category.imageType = req.file.mimetype;
        }

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

// DELETE CATEGORY
exports.categoryDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);
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
