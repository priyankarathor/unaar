const path = require('path');
const fs = require('fs');
const GoldenVisa = require("../model/Goldenvisa");

// ADD
//add link also
exports.goldenvisaadd = async (req, res) => {
    try {
        const { title, subtitle, description, buttontitle, link } = req.body;
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

        const newGoldenVisa = new GoldenVisa({
            title,
            subtitle,
            description,
            image: imageFilename,
            buttontitle,
            link,
        });

        await newGoldenVisa.save();

        res.status(201).json({
            status: true,
            message: "Golden Visa saved successfully",
            data: newGoldenVisa
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};

// GET
exports.goldenvisaget = async (req, res) => {
    try {
        const goldenVisas = await GoldenVisa.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            message: "Golden Visa records fetched successfully",
            data: goldenVisas
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: []
        });
    }
};

// EDIT
exports.goldenvisaedit = async (req, res) => {
    try {
        const { title, subtitle, description, buttontitle,link } = req.body;
        const { id } = req.params;

        const goldenVisa = await GoldenVisa.findById(id);

        if (!goldenVisa) {
            return res.status(404).json({
                status: false,
                message: "Golden Visa not found",
                data: null
            });
        }

        if (req.file) {
            // Delete old image
            if (goldenVisa.image) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', goldenVisa.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Save new image
            const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            const newImageFilename = Date.now() + '-' + req.file.originalname;
            fs.writeFileSync(path.join(uploadsDir, newImageFilename), buffer);

            goldenVisa.image = newImageFilename;
        }

        goldenVisa.title = title;
        goldenVisa.subtitle = subtitle;
        goldenVisa.description = description;
        goldenVisa.buttontitle = buttontitle;
        goldenVisa.link = link;

        const updatedGoldenVisa = await goldenVisa.save();

        res.status(200).json({
            status: true,
            message: "Golden Visa updated successfully",
            data: updatedGoldenVisa
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};

// DELETE
exports.goldenvisadelete = async (req, res) => {
    try {
        const { id } = req.params;

        const goldenVisa = await GoldenVisa.findByIdAndDelete(id);

        if (!goldenVisa) {
            return res.status(404).json({
                status: false,
                message: "Golden Visa not found",
                data: null
            });
        }

        // Delete associated image
        if (goldenVisa.image) {
            const imagePath = path.join(__dirname, '..', 'uploads', goldenVisa.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({
            status: true,
            message: "Golden Visa deleted successfully",
            data: goldenVisa
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};
