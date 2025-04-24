const category = require('../model/category');
const fs = require('fs');
const path = require('path');

// INSERT
exports.categoryinsert = async (req, res) => {
    try {
        const { categorytype, categoryvalue, action } = req.body;
        const image = req.file ? `../image/${req.file.filename}` : '';

        const categorydata = new category({ categorytype, categoryvalue, image, action });
        await categorydata.save();

        res.status(200).json({
            status: true,
            message: "Category data inserted",
            categoryinsert: categorydata
        });
    } catch (error) {
        res.status(401).json({
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
        const categorydataget = await category.find().sort({ _id: -1 }); // latest first
        res.status(200).json({
            status: true,
            message: "Category data fetched",
            categoryfatch: categorydataget
        });
    } catch (error) {
        res.status(401).json({
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

        // If a new image is uploaded, remove the old one
        let updatedImage = existingCategory.image;
        if (req.file) {
            if (existingCategory.image) {
                const oldPath = path.join(__dirname, '..', existingCategory.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            updatedImage = `../image/${req.file.filename}`;
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
        if (deletedcategory.image) {
            const imagePath = path.join(__dirname, '..', deletedcategory.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
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
