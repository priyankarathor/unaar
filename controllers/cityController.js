const City = require('../model/City'); // Use PascalCase for Mongoose model references

// Utility: Get content type from extension or MIME
const getContentType = (filenameOrType) => {
    const extensionMap = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        webp: 'image/webp',
        bmp: 'image/bmp',
        tiff: 'image/tiff',
        ico: 'image/x-icon',
    };

    const ext = (filenameOrType || '').split('.').pop().toLowerCase();
    return extensionMap[ext] || 'application/octet-stream';
};

// ========================= INSERT =========================
exports.subtosubcityInsert = async (req, res) => {
    try {
        const {
            masterId,
            subcategoryId,
            subtosubcategoryId,
            categorytype,
            categoryvalue,
            action
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Image is required"
            });
        }

        const newCity = new City({
            image: req.file.buffer,
            imageType: req.file.mimetype,
            masterId,
            subcategoryId,
            subtosubcategoryId,
            categorytype,
            categoryvalue,
            action
        });

        const savedCity = await newCity.save();

        res.status(201).json({
            status: true,
            message: "City inserted successfully",
            data: savedCity
        });
    } catch (error) {
        console.error('Error inserting city:', error);
        res.status(500).json({
            status: false,
            message: "Failed to insert city",
            error: error.message
        });
    }
};

// ========================= GET =========================
exports.subtosubcityGet = async (req, res) => {
    try {
        const cities = await City.find().sort({ createdAt: -1 });

        const formattedCities = cities.map(city => ({
            _id: city._id,
            masterId: city.masterId,
            subcategoryId: city.subcategoryId,
            subtosubcategoryId: city.subtosubcategoryId,
            categorytype: city.categorytype,
            categoryvalue: city.categoryvalue,
            action: city.action,
            image: city.image ? {
                data: city.image,
                contentType: getContentType(city.imageType || 'jpg')
            } : null
        }));

        res.status(200).json({
            status: true,
            message: "Cities fetched successfully",
            data: formattedCities
        });
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch cities",
            error: error.message
        });
    }
};

// ========================= EDIT =========================
exports.subtosubcityEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            masterId,
            subcategoryId,
            subtosubcategoryId,
            categorytype,
            categoryvalue,
            action
        } = req.body;

        const city = await City.findById(id);
        if (!city) {
            return res.status(404).json({
                status: false,
                message: "City not found"
            });
        }

        // Update image if new file uploaded
        if (req.file) {
            city.image = req.file.buffer;
            city.imageType = req.file.mimetype;
        }

        // Update fields
        city.masterId = masterId;
        city.subcategoryId = subcategoryId;
        city.subtosubcategoryId = subtosubcategoryId;
        city.categorytype = categorytype;
        city.categoryvalue = categoryvalue;
        city.action = action;

        const updatedCity = await city.save();

        res.status(200).json({
            status: true,
            message: "City updated successfully",
            data: updatedCity
        });
    } catch (error) {
        console.error('Error updating city:', error);
        res.status(500).json({
            status: false,
            message: "Failed to update city",
            error: error.message
        });
    }
};

// ========================= DELETE =========================
exports.subtosubcityDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCity = await City.findByIdAndDelete(id);
        if (!deletedCity) {
            return res.status(404).json({
                status: false,
                message: "City not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "City deleted successfully",
            data: deletedCity
        });
    } catch (error) {
        console.error('Error deleting city:', error);
        res.status(500).json({
            status: false,
            message: "Failed to delete city",
            error: error.message
        });
    }
};
