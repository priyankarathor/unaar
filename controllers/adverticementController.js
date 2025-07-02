const Advertisement = require("../model/adverticement"); // Ensure the correct path to your Mongoose model

// ADD Advertisement
exports.advertisementAdd = async (req, res) => {
    try {
        const { description, status } = req.body;

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Image is required",
            });
        }

        const newAdvertisement = new Advertisement({
            image: req.file.buffer,        // Store image as Buffer
            imageType: req.file.mimetype,  // Store MIME type
            description,
            status
        });

        await newAdvertisement.save();

        res.status(201).json({
            status: true,
            message: "Advertisement inserted successfully",
            data: newAdvertisement
        });

    } catch (error) {
        console.error("Error inserting advertisement:", error);
        res.status(500).json({
            status: false,
            message: "Failed to insert advertisement",
            error: error.message
        });
    }
};

// GET ALL Advertisements
exports.advertisementGet = async (req, res) => {
    try {
        const advertisements = await Advertisement.find().sort({ createdAt: -1 });

        const advertisementList = advertisements.map(ad => ({
            _id: ad._id,
            image: ad.image ? {
                data: ad.image,
                contentType: ad.imageType || 'image/png'
            } : null,
            description: ad.description,
            status: ad.status,
            createdAt: ad.createdAt
        }));

        res.status(200).json({
            status: true,
            message: "Advertisements fetched successfully",
            data: advertisementList
        });

    } catch (error) {
        console.error("Error fetching advertisements:", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch advertisements",
            error: error.message
        });
    }
};

// EDIT Advertisement
exports.advertisementEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, status } = req.body;

        const advertisement = await Advertisement.findById(id);
        if (!advertisement) {
            return res.status(404).json({
                status: false,
                message: "Advertisement not found"
            });
        }

        // Update image if new file provided
        if (req.file) {
            advertisement.image = req.file.buffer;
            advertisement.imageType = req.file.mimetype;
        }

        // Update fields if provided
        advertisement.description = description || advertisement.description;
        advertisement.status = status || advertisement.status;

        const updatedAd = await advertisement.save();

        res.status(200).json({
            status: true,
            message: "Advertisement updated successfully",
            data: updatedAd
        });

    } catch (error) {
        console.error("Error updating advertisement:", error);
        res.status(500).json({
            status: false,
            message: "Failed to update advertisement",
            error: error.message
        });
    }
};

// DELETE Advertisement
exports.advertisementDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAd = await Advertisement.findByIdAndDelete(id);
        if (!deletedAd) {
            return res.status(404).json({
                status: false,
                message: "Advertisement not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Advertisement deleted successfully",
            data: deletedAd
        });

    } catch (error) {
        console.error("Error deleting advertisement:", error);
        res.status(500).json({
            status: false,
            message: "Failed to delete advertisement",
            error: error.message
        });
    }
};
