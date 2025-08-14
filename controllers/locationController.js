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


exports.bulkLocationInsert = async (req, res) => {
  try {
    console.log('Incoming location data:', req.body); // 👈 log this

    const locations = req.body;

    if (!Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Request body must be a non-empty array of locations.",
        data: null,
      });
    }

    const insertedLocations = await Location.insertMany(locations);

    res.status(201).json({
      status: true,
      message: "Bulk location insert successful",
      data: insertedLocations,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Bulk insert failed: " + error.message,
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

//filter all state wise 
exports.toplocationsofcountry = async (req, res) => {
  try {
    const result = await Location.aggregate([
      {
        // Step 1: Normalize and clean country and state
        $addFields: {
          normalizedCountry: {
            $trim: {
              input: { $toLower: "$Country" }
            }
          },
          normalizedState: {
            $trim: {
              input: { $toLower: "$State" }
            }
          }
        }
      },
      {
        // ✅ Step 1.5: Filter for United Arab Emirates only
        $match: {
          normalizedCountry: "united arab emirates"
        }
      },
      {
        // Step 2: Group by normalized country and state
        $group: {
          _id: {
            country: "$normalizedCountry",
            state: "$normalizedState"
          },
          originalCountry: { $first: "$Country" },
          originalState: { $first: "$State" },
          count: { $sum: 1 }
        }
      },
      {
        // Step 3: Sort within groups
        $sort: {
          "_id.country": 1,
          count: -1
        }
      },
      {
        // Step 4: Group again by country to collect states
        $group: {
          _id: "$_id.country",
          country: { $first: "$originalCountry" },
          states: {
            $push: {
              state: "$originalState",
              count: "$count"
            }
          }
        }
      },
      {
        // Step 5: Project clean output
        $project: {
          _id: 0,
          country: 1,
          states: 1
        }
      }
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /toplocations API:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



//filter all
exports.toplocationsall = async (req, res) => {
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
        $limit: 50
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

//get country(count) -> state(count) -> city(count) -> location (count)
exports.locationsfilter = async (req, res) => {
  try {
    const { country, state, city } = req.query;

    const matchStage = {};
    if (country) matchStage.Country = country;
    if (state) matchStage.State = state;
    if (city) matchStage.City = city;

    const pipeline = [
      { $match: matchStage },

      {
        $group: {
          _id: {
            country: "$Country",
            state: "$State",
            city: "$City",
            location: "$locationlable"
          },
          count: { $sum: 1 }
        }
      },

      {
        $group: {
          _id: {
            country: "$_id.country",
            state: "$_id.state",
            city: "$_id.city"
          },
          locations: {
            $push: {
              location: "$_id.location",
              count: "$count"
            }
          },
          cityCount: { $sum: "$count" }
        }
      },

      {
        $group: {
          _id: {
            country: "$_id.country",
            state: "$_id.state"
          },
          cities: {
            $push: {
              city: "$_id.city",
              count: "$cityCount",
              locations: "$locations"
            }
          },
          stateCount: { $sum: "$cityCount" }
        }
      },

      {
        $group: {
          _id: {
            country: "$_id.country"
          },
          states: {
            $push: {
              state: "$_id.state",
              count: "$stateCount",
              cities: "$cities"
            }
          },
          countryCount: { $sum: "$stateCount" }
        }
      },

      {
        $project: {
          _id: 0,
          country: "$_id.country",
          count: "$countryCount",
          states: 1
        }
      }
    ];

    const result = await Location.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Delete all locations by property ID
exports.locationDelete = async (req, res) => {
  try {
    const { id } = req.params; // this is the property ID
    const deletedLocations = await Location.deleteMany({ PropertyId: id });

    if (deletedLocations.deletedCount === 0) {
      return res.status(404).json({
        status: false,
        message: 'No location found for this property ID',
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Location(s) deleted successfully',
      data: deletedLocations,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong: ' + error.message,
      data: null,
    });
  }
};

//edit by propertyid 
exports.locationEditByPropertyId = async (req, res) => {
    try {
        const { PropertyId } = req.params; // PropertyId from route param
        const { Country, State, City, locationlable } = req.body;

        // Find and update the location by PropertyId
        const updatedLocation = await Location.findOneAndUpdate(
            { PropertyId }, // Search condition
            { Country, State, City, locationlable }, // Fields to update
            { new: true, runValidators: true } // Return updated doc + run validators
        );

        if (!updatedLocation) {
            return res.status(404).json({
                status: false,
                message: `Location not found for PropertyId: ${PropertyId}`,
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: "Location updated successfully",
            data: updatedLocation
        });

    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};

