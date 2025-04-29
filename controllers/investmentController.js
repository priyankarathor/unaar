const Investment = require('../model/Investment');
const fs = require('fs');
const path = require('path');
const { Blob } = require('buffer'); 

// INSERT CATEGORY
exports.Investeraddd = async (req, res) => {
    try {
        const { title, subtitle, description, buttontitle } = req.body;
        let imageFilename = null;

        if (req.file) {
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            imageFilename = Date.now() + '-' + req.file.originalname;
            fs.writeFileSync(path.join(uploadsDir, imageFilename), buffer);
        }

        const newCategory = new Category({
            title,
            subtitle,
            description,
            buttontitle,
            image: imageFilename
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
        console.error(error);
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

        if (req.file) {
            // Delete old image
            if (category.image) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', category.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Save new image using Blob
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            const newImageFilename = Date.now() + '-' + req.file.originalname;
            fs.writeFileSync(path.join(uploadsDir, newImageFilename), buffer);

            category.image = newImageFilename;
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
        console.error(error);
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
            const imagePath = path.join(__dirname, '..', 'uploads', category.image);
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
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};
