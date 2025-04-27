const Category = require('../model/category');
const fs = require('fs');
const path = require('path');

// INSERT CATEGORY
exports.categoryInsert = async (req, res) => {
    try {
        const { categorytype, categoryvalue, action } = req.body;
        const image = req.file ? req.file.filename : '';

        const newCategory = new Category({
            categorytype,
            categoryvalue,
            image,
            action
        });

        await newCategory.save();

        res.status(201).json({
            status: true,
            message: "Category inserted successfully",
            data: newCategory
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to insert category",
            error: error.message
        });
    }
};

// GET ALL CATEGORIES
exports.categoryGet = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            message: "Categories fetched successfully",
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to fetch categories",
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

        // If a new image is uploaded
        if (req.file) {
            // Delete old image
            if (category.image) {
                const oldImagePath = path.join(__dirname, '../uploads/', category.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            category.image = req.file.filename;
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

        // Delete associated image
        if (category.image) {
            const imagePath = path.join(__dirname, '../uploads/', category.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({
            status: true,
            message: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};
