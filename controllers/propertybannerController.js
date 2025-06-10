const PropertyBanner = require("../model/propertybanner"); // Ensure correct path

// ADD PropertyBanner
exports.propertyBannerAdd = async (req, res) => {
    try {
        const { buttontag, description, status } = req.body;

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Image is required",
            });
        }

        const newBanner = new PropertyBanner({
            image: req.file.buffer,
            imageType: req.file.mimetype,
            description,
            status,
            buttontag,
        });

        await newBanner.save();

        res.status(201).json({
            status: true,
            message: "Property banner added successfully",
            data: newBanner,
        });

    } catch (error) {
        console.error("Error inserting property banner:", error);
        res.status(500).json({
            status: false,
            message: "Failed to insert property banner",
            error: error.message,
        });
    }
};

// GET ALL PropertyBanners
exports.propertyBannerGet = async (req, res) => {
    try {
        const banners = await PropertyBanner.find().sort({ createdAt: -1 });

        const formattedBanners = banners.map(banner => ({
            _id: banner._id,
            image: banner.image ? {
                data: banner.image,
                contentType: banner.imageType || 'image/png',
            } : null,
            description: banner.description,
            status: banner.status,
            buttontag: banner.buttontag,
            createdAt: banner.createdAt,
        }));

        res.status(200).json({
            status: true,
            message: "Property banners fetched successfully",
            data: formattedBanners,
        });

    } catch (error) {
        console.error("Error fetching property banners:", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch property banners",
            error: error.message,
        });
    }
};

// EDIT PropertyBanner
exports.propertyBannerEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, status, buttontag } = req.body;

        const banner = await PropertyBanner.findById(id);
        if (!banner) {
            return res.status(404).json({
                status: false,
                message: "Property banner not found",
            });
        }

        if (req.file) {
            banner.image = req.file.buffer;
            banner.imageType = req.file.mimetype;
        }

        if (description !== undefined) banner.description = description;
        if (status !== undefined) banner.status = status;
        if (buttontag !== undefined) banner.buttontag = buttontag;

        const updatedBanner = await banner.save();

        res.status(200).json({
            status: true,
            message: "Property banner updated successfully",
            data: updatedBanner,
        });

    } catch (error) {
        console.error("Error updating property banner:", error);
        res.status(500).json({
            status: false,
            message: "Failed to update property banner",
            error: error.message,
        });
    }
};

// DELETE PropertyBanner
exports.propertyBannerDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBanner = await PropertyBanner.findByIdAndDelete(id);
        if (!deletedBanner) {
            return res.status(404).json({
                status: false,
                message: "Property banner not found",
            });
        }

        res.status(200).json({
            status: true,
            message: "Property banner deleted successfully",
            data: deletedBanner,
        });

    } catch (error) {
        console.error("Error deleting property banner:", error);
        res.status(500).json({
            status: false,
            message: "Failed to delete property banner",
            error: error.message,
        });
    }
};
