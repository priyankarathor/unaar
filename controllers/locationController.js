const Location = require('../model/location');
const PropertyListing = require('../model/PropertyListing');


// exports.propertyfilter = async (req, res) => {
//     try {
//         const { country, state, city } = req.query;

//         // Build a dynamic query object
//         const query = {};
//         if (country) query.country = country;
//         if (state) query.state = state;
//         if (city) query.city = city;

//         const filteredProperties = await PropertyListing.find(query).sort({ createdAt: -1 });

//         res.status(200).json({
//             status: true,
//             message: "Properties fetched successfully",
//             data: filteredProperties,
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: "Error fetching properties",
//             error: error.message,
//         });
//     }
// };



// Insert a new location
exports.locationInsert = async (req, res) => {
try {
        const { Country, State, City, PropertyId, locationlable } = req.body;
        const LocationSectionData = new Location({ Country, State, City, PropertyId, locationlable});
        await LocationSectionData.save();
        res.status(201).json({
            status: true,
            message: "Location created successfully",
            data: LocationSectionData,
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null,
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
      locationlable: location.locationlable,
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
