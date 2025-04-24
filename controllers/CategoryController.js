const category = require('../model/category');
const fs = require('fs');
const path = require('path');

// INSERT
exports.categoryinsert = async (req, res) => {
    try {
        const { categorytype, categoryvalue, action } = req.body;
        const image = req.file ? req.file.path : '';

        const categorydata = new category({ categorytype, categoryvalue, image, action });
        await categorydata.save();

        res.status(200).json({
            status: true,
            message: "Category data inserted",
            categoryinsert: categorydata
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Category data not inserted",
            error: error.message,
            categoryinsert: null
        });
    }
};

// READ
exports.categoryget = async (req, res) => {
    try {
        const categorydataget = await category.find().sort({ _id: -1 });
        res.status(200).json({
            status: true,
            message: "Category data fetched",
            categoryfatch: categorydataget
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Category data not fetched",
            error: error.message,
            categoryfatch: null
        });
    }
};

// EDIT
exports.categoryedit = async (req, res) => {
    try {
        const { id } = req.params;
        const { categorytype, categoryvalue, action } = req.body;

        const existingCategory = await category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ status: false, message: "Category not found", data: null });
        }

        // If new image, delete old one
        let updatedImage = existingCategory.image;
        if (req.file) {
            if (existingCategory.image && fs.existsSync(existingCategory.image)) {
                fs.unlinkSync(existingCategory.image);
            }
            updatedImage = req.file.path;
        }

        const updatedData = await category.findByIdAndUpdate(
            id,
            { categorytype, categoryvalue, image: updatedImage, action },
            { new: true }
        );

        res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: updatedData
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};

// DELETE
exports.categorydelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedcategory = await category.findByIdAndDelete(id);

        if (!deletedcategory) {
            return res.status(404).json({
                status: false,
                message: "Category not found",
                data: null
            });
        }

        // Delete image from server
        if (deletedcategory.image && fs.existsSync(deletedcategory.image)) {
            fs.unlinkSync(deletedcategory.image);
        }

        res.status(200).json({
            status: true,
            message: "Category deleted successfully",
            data: deletedcategory
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};
