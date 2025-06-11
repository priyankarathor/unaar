const PropertyBanner = require("../model/propertybanner"); // Ensure correct path

// ADD PropertyBanner
exports.propertyBannerAdd = async (req, res) => {
    try {
        const { 
            tag,
            buttontag, 
            categoryProperty, 
            location, 
            latitude, 
            longitude, 
            country, 
            city, 
            state, 
            loactionlabal 
        } = req.body; 

        const newBanner = new PropertyBanner({
            tag,
            buttontag,
            categoryProperty,
            location,
            latitude,
            longitude,
            country,
            city,
            state,
            loactionlabal
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

        res.status(200).json({
            status: true,
            message: "Property banners fetched successfully",
            data: banners,
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
        const {
            tag,
            buttontag,
            categoryProperty,
            location,
            latitude,
            longitude,
            country,
            city,
            state,
            loactionlabal
        } = req.body;

        const banner = await PropertyBanner.findById(id);
        if (!banner) {
            return res.status(404).json({
                status: false,
                message: "Property banner not found",
            });
        }

        // Update only if fields are provided
    if (tag !== undefined) banner.tag = tag;
        if (buttontag !== undefined) banner.buttontag = buttontag;
        if (categoryProperty !== undefined) banner.categoryProperty = categoryProperty;
        if (location !== undefined) banner.location = location;
        if (latitude !== undefined) banner.latitude = latitude;
        if (longitude !== undefined) banner.longitude = longitude;
        if (country !== undefined) banner.country = country;
        if (city !== undefined) banner.city = city;
        if (state !== undefined) banner.state = state;
        if (loactionlabal !== undefined) banner.loactionlabal = loactionlabal;

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
