const Category = require('../model/category'); 
const fs = require('fs');
const path = require('path');

// INSERT
exports.categoryInsert = async (req, res) => {
    try {
        const { categorytype, categoryvalue, action } = req.body;
        const imagePath = req.file ? req.file.path : '';

        const categoryData = new Category({
            categorytype,
            categoryvalue,
            image: imagePath,
            action
        });

        await categoryData.save();

        res.status(200).json({
            status: true,
            message: "Category inserted successfully",
            data: categoryData
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to insert category",
            error: error.message,
            data: null
        });
    }
};

// READ
exports.categoryGet = async (req, res) => {
    try {
        const categories = await Category.find().sort({ _id: -1 });
        res.status(200).json({
            status: true,
            message: "Category data fetched successfully",
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to fetch category data",
            error: error.message,
            data: null
        });
    }
};

// EDIT
exports.categoryEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { categorytype, categoryvalue, action } = req.body;

        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ status: false, message: "Category not found", data: null });
        }

        let imagePath = existingCategory.image;
        if (req.file) {
            // Delete old image
            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            imagePath = req.file.path;
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { categorytype, categoryvalue, image: imagePath, action },
            { new: true }
        );

        res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to update category",
            error: error.message,
            data: null
        });
    }
};

// DELETE
exports.categoryDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                status: false,
                message: "Category not found",
                data: null
            });
        }

        // Delete associated image
        if (deletedCategory.image && fs.existsSync(deletedCategory.image)) {
            fs.unlinkSync(deletedCategory.image);
        }

        res.status(200).json({
            status: true,
            message: "Category deleted successfully",
            data: deletedCategory
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to delete category",
            error: error.message,
            data: null
        });
    }
};
