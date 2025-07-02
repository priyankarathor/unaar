const PropertyBanner = require("../model/propertybanner");

// ADD Property Banner
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
            locationlabel,
            propertyId,
            developerId,
            adverticesvalue,
            adverticestext,
            bannertype
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
            locationlabel,
            propertyId,
            developerId,
            adverticesvalue,
            adverticestext,
            bannertype
        });

        if (req.file) {
            newBanner.image = req.file.buffer;
            newBanner.imageType = req.file.mimetype;
        }

        await newBanner.save();

        res.status(201).json({
            status: true,
            message: "Property banner added successfully",
            data: newBanner
        });

    } catch (error) {
        console.error("Error adding property banner:", error);
        res.status(500).json({
            status: false,
            message: "Failed to add property banner",
            error: error.message
        });
    }
};

// GET All Property Banners
exports.propertyBannerGet = async (req, res) => {
    try {
        const banners = await PropertyBanner.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            message: "Property banners fetched successfully",
            data: banners
        });

    } catch (error) {
        console.error("Error fetching property banners:", error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch property banners",
            error: error.message
        });
    }
};

// EDIT Property Banner
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
            locationlabel,
            propertyId,
            developerId,
            adverticesvalue,
            adverticestext,
            bannertype
        } = req.body;

        const banner = await PropertyBanner.findById(id);
        if (!banner) {
            return res.status(404).json({
                status: false,
                message: "Property banner not found"
            });
        }

        // Update fields if present
        if (tag !== undefined) banner.tag = tag;
        if (buttontag !== undefined) banner.buttontag = buttontag;
        if (categoryProperty !== undefined) banner.categoryProperty = categoryProperty;
        if (location !== undefined) banner.location = location;
        if (latitude !== undefined) banner.latitude = latitude;
        if (longitude !== undefined) banner.longitude = longitude;
        if (country !== undefined) banner.country = country;
        if (city !== undefined) banner.city = city;
        if (state !== undefined) banner.state = state;
        if (locationlabel !== undefined) banner.locationlabel = locationlabel;
        if (propertyId !== undefined) banner.propertyId = propertyId;
        if (developerId !== undefined) banner.developerId = developerId;
        if (adverticesvalue !== undefined) banner.adverticesvalue = adverticesvalue;
        if (adverticestext !== undefined) banner.adverticestext = adverticestext;
        if (bannertype !== undefined) banner.bannertype = bannertype;

        if (req.file) {
            banner.image = req.file.buffer;
            banner.imageType = req.file.mimetype;
        }

        const updatedBanner = await banner.save();

        res.status(200).json({
            status: true,
            message: "Property banner updated successfully",
            data: updatedBanner
        });

    } catch (error) {
        console.error("Error updating property banner:", error);
        res.status(500).json({
            status: false,
            message: "Failed to update property banner",
            error: error.message
        });
    }
};

// DELETE Property Banner
exports.propertyBannerDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBanner = await PropertyBanner.findByIdAndDelete(id);
        if (!deletedBanner) {
            return res.status(404).json({
                status: false,
                message: "Property banner not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Property banner deleted successfully",
            data: deletedBanner
        });

    } catch (error) {
        console.error("Error deleting property banner:", error);
        res.status(500).json({
            status: false,
            message: "Failed to delete property banner",
            error: error.message
        });
    }
};
