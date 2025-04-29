const path = require("path");
const fs = require("fs");
const Agencies = require("../model/Agencie"); // Make sure the model file name is correct

// ADD
exports.agenciesadd = async (req, res) => {
    try {
        const { link, agenciename } = req.body;
        let imageFilename = null;

        if (req.file) {
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            imageFilename = Date.now() + '-' + req.file.originalname;
            const imagePath = path.join(uploadsDir, imageFilename);
            fs.writeFileSync(imagePath, req.file.buffer);
        }

        const newAgency = new Agencies({
            image: imageFilename,
            link,
            agenciename,
        });

        await newAgency.save();

        res.status(201).json({
            status: true,
            message: "Agency inserted successfully",
            data: newAgency
        });
    } catch (error) {
        console.error('Error inserting agency:', error);
        res.status(500).json({
            status: false,
            message: "Failed to insert agency",
            error: error.message
        });
    }
};

// GET ALL
exports.agenciesget = async (req, res) => {
    try {
        const agenciesList = await Agencies.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            message: "Agencies fetched successfully",
            data: agenciesList
        });
    } catch (error) {
        console.error('Error fetching agencies:', error);
        res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message,
            data: []
        });
    }
};

// EDIT
exports.agenciesedit = async (req, res) => {
    try {
        const { id } = req.params;
        const { link, agenciename } = req.body;

        const agency = await Agencies.findById(id);
        if (!agency) {
            return res.status(404).json({
                status: false,
                message: "Agency not found"
            });
        }

        if (req.file) {
            // Delete old image if exists
            if (agency.image) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', agency.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Save new image
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            const newImageFilename = Date.now() + '-' + req.file.originalname;
            const imagePath = path.join(uploadsDir, newImageFilename);
            fs.writeFileSync(imagePath, req.file.buffer);

            agency.image = newImageFilename;
        }

        agency.link = link;
        agency.agenciename = agenciename;

        const updatedAgency = await agency.save();

        res.status(200).json({
            status: true,
            message: "Agency updated successfully",
            data: updatedAgency
        });
    } catch (error) {
        console.error('Error updating agency:', error);
        res.status(500).json({
            status: false,
            message: "Failed to update agency",
            error: error.message
        });
    }
};

// DELETE
exports.agenciesdelete = async (req, res) => {
    try {
        const { id } = req.params;

        const agency = await Agencies.findByIdAndDelete(id);
        if (!agency) {
            return res.status(404).json({
                status: false,
                message: "Agency not found"
            });
        }

        // Delete associated image
        if (agency.image) {
            const imagePath = path.join(__dirname, '..', 'uploads', agency.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({
            status: true,
            message: "Agency deleted successfully",
            data: agency
        });
    } catch (error) {
        console.error('Error deleting agency:', error);
        res.status(500).json({
            status: false,
            message: "Failed to delete agency",
            error: error.message
        });
    }
};
