const Location = require('../model/location'); // Use PascalCase for model (convention)

// Insert a new location
exports.locationInsert = async (req, res) => {
    try {
        const { Country, State, City, PropertyId } = req.body;

        // If you want to handle image upload, you should also save the image info in the DB (currently missing)
        if (!req.file) {
            return res.status(400).json({ status: false, message: "Image is required" });
        }

        // Create new location instance
        const newLocation = new Location({
            Country,
            State,
            City,
            PropertyId,
            // Optionally store image info if needed, e.g.:
            // image: req.file.filename or req.file.path
        });

        await newLocation.save();

        res.status(201).json({
            status: true,
            message: "Location inserted successfully",
            data: newLocation
        });
    } catch (error) {
        console.error('Error inserting location:', error);
        res.status(500).json({
            status: false,
            message: "Failed to insert location",
            error: error.message
        });
    }
};

// Get all locations
exports.locationsGet = async (req, res) => {
    try {
        // Use Location (not locations) - the model variable
        const locations = await Location.find().sort({ createdAt: -1 });

        // Fix syntax error in map: no `: null` and properly returning an object
        const locationsWithImage = locations.map(location => ({
            _id: location._id,
            Country: location.Country,
            State: location.State,
            City: location.City,
            PropertyId: location.PropertyId,
            // Include image if stored, e.g. image: location.image
        }));

        res.status(200).json({
            status: true,
            message: "Locations fetched successfully",
            data: locationsWithImage
        });
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({
            status: false,
            message: "Failed to fetch locations",
            error: error.message
        });
    }
};
