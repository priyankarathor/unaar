// controllers/propertyController.js
const PropertyListing = require('../model/PropertyListing');

const bulkInsertProperties = async (req, res) => {
  try {
    let data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array.' });
    }

    // Clean each object (remove nearbyPlaces)
    const cleanedData = data.map(({ nearbyPlaces, ...rest }) => rest);

    const inserted = await PropertyListing.insertMany(cleanedData);
    res.status(200).json({
      message: 'Bulk insert successful',
      insertedCount: inserted.length,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Bulk insert failed',
      error: error.message,
    });
  }
};

module.exports = { bulkInsertProperties };
