const Location = require('../model/location');

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


//filter top 4 
exports.toplocations = async (req, res) => {
  try {
    const result = await Location.aggregate([
      {
        // Step 1: Normalize the locationlable (remove symbols, extra spaces, convert to lowercase)
        $addFields: {
          normalizedLabel: {
            $trim: {
              input: {
                $replaceAll: {
                  input: {
                    $toLower: "$locationlable"
                  },
                  find: "-",
                  replacement: ""
                }
              }
            }
          }
        }
      },
      {
        // Optional: Remove extra spaces and unify format further
        $addFields: {
          normalizedLabel: {
            $replaceAll: {
              input: "$normalizedLabel",
              find: " ",
              replacement: ""
            }
          }
        }
      },
      {
        // Step 2: Group by normalizedLabel
        $group: {
          _id: "$normalizedLabel",
          originalLabel: { $first: "$locationlable" },
          count: { $sum: 1 }
        }
      },
      {
        // Step 3: Sort by count
        $sort: { count: -1 }
      },
      {
        // Step 4: Limit to top 4
        $limit: 4
      },
      {
        // Step 5: Project clean response
        $project: {
          _id: 0,
          locationlable: "$originalLabel", // return one version of the label
          count: 1
        }
      }
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /toplocations API:", err);
    res.status(500).json({ error: 'Internal Server Error' });
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
