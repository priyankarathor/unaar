const Location = require('../model/location');

// Insert a new location
exports.locationInsert = async (req, res) => {
  try {
    // Check if body is provided
    if (!req.body) {
      return res.status(400).json({
        status: false,
        message: "Request body is missing",
      });
    }

    const { Country, State, City, PropertyId } = req.body;

    // Validate required fields
    if (!Country || !State || !City || !PropertyId) {
      return res.status(400).json({
        status: false,
        message: "All fields (Country, State, City, PropertyId) are required",
      });
    }

    // Create and save new location document
    const newLocation = new Location({ Country, State, City, PropertyId });
    await newLocation.save();

    res.status(201).json({
      status: true,
      message: "Location inserted successfully",
      data: newLocation,
    });
  } catch (error) {
    console.error('Error inserting location:', error);
    res.status(500).json({
      status: false,
      message: "Failed to insert location",
      error: error.message,
    });
  }
};

// Get all locations
exports.locationsGet = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });

    const formattedLocations = locations.map(location => ({
      _id: location._id,
      Country: location.Country,
      State: location.State,
      City: location.City,
      PropertyId: location.PropertyId,
      createdAt: location.createdAt,
      updatedAt: location.updatedAt,
    }));

    res.status(200).json({
      status: true,
      message: "Locations fetched successfully",
      data: formattedLocations,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch locations",
      error: error.message,
    });
  }
};
