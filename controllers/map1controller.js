const map1 = require("../model/map"); // Ensure the correct path to your Mongoose model

// ADD map
exports.mapAdd = async (req, res) => {
    try {
        const { status } = req.body;

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Image is required",
            });
        }

        const newmap = new map({
            image: req.file.buffer,        // Store image as Buffer
            imageType: req.file.mimetype,  // Store MIME type
            status
        });

        await newmap.save();

        res.status(201).json({
            status: true,
            message: "map inserted successfully",
            data: newmap
        });

    } catch (error) {
        console.error("Error inserting map:", error);
        res.status(500).json({
            status: false,
            message: "Failed to insert map",
            error: error.message
        });
    }
};

// GET ALL maps
exports.mapGet = async (req, res) => {
    try {
        const maps = await map.find().sort({ createdAt: -1 });

        const mapList = maps.map(ad => ({
            _id: ad._id,
            image: ad.image ? {
                data: ad.image,
                contentType: ad.imageType || 'image/png'
            } : null,
            status: ad.status,
            createdAt: ad.createdAt
        }));

        res.status(200).json({
            status: true,
            message: "maps fetched successfully",
            data: mapList
        });

    } catch (error) {
        console.error("Error fetching maps:", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch maps",
            error: error.message
        });
    }
};

// EDIT map
exports.mapEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const map = await map.findById(id);
        if (!map) {
            return res.status(404).json({
                status: false,
                message: "map not found"
            });
        }

        // Update image if new file provided
        if (req.file) {
            map.image = req.file.buffer;
            map.imageType = req.file.mimetype;
        }

        // Update fields if provided
        map.status = status || map.status;

        const updatedAd = await map.save();

        res.status(200).json({
            status: true,
            message: "map updated successfully",
            data: updatedAd
        });

    } catch (error) {
        console.error("Error updating map:", error);
        res.status(500).json({
            status: false,
            message: "Failed to update map",
            error: error.message
        });
    }
};

// DELETE map
exports.mapDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAd = await map.findByIdAndDelete(id);
        if (!deletedAd) {
            return res.status(404).json({
                status: false,
                message: "map not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "map deleted successfully",
            data: deletedAd
        });

    } catch (error) {
        console.error("Error deleting map:", error);
        res.status(500).json({
            status: false,
            message: "Failed to delete map",
            error: error.message
        });
    }
};
