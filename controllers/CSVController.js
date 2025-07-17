// controllers/propertyController.js
const PropertyListing = require('../model/PropertyListing');

const axios = require('axios');

const bulkInsertProperties = async (req, res) => {
  try {
    const rows = JSON.parse(req.body.rows); // frontend sends JSON stringified array of CSV rows

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: "No valid CSV data provided." });
    }

    const documents = rows.map(row => ({
      country: row.country,
      state: row.state,
      city: row.city,
      title: row.title,
      subtitle: row.subtitle || 'Residential',
      developer: row.developer,
      fromamout: row.fromamout,
      type: row.type,
      growthrate: row.growthrate,
      loginId: row.loginId,
      status: row.status || 'Pending',

      propertylabel: parseJSONField(row.propertylabel),
      propertyvalue: parseJSONField(row.propertyvalue),

      descriptiontitle: row.descriptiontitle,
      descriptionlabel: parseJSONField(row.descriptionlabel),
      descriptionvalue: parseJSONField(row.descriptionvalue),
      description: row.description,

      facilitieid: parseJSONField(row.facilitieid),
      facilitiedescription: row.facilitiedescription,
      featureId: parseJSONField(row.featureId),

      latitude: parseJSONField(row.latitude),
      longitude: parseJSONField(row.longitude),
      locationlable: parseJSONField(row.locationlable),
      locationvalue: parseJSONField(row.locationvalue),
      locationvaluetitle: row.locationvaluetitle,
      locationdescription: row.locationdescription,

      apartmenttitle: row.apartmenttitle,
      apartmentlable: parseJSONField(row.apartmentlable),
      apartmendescription: parseJSONField(row.apartmendescription),

      remotelocationtitle: parseJSONField(row.remotelocationtitle),
      remotelocationsubtitle: parseJSONField(row.remotelocationsubtitle),

      Currency: row.Currency,
      tagtitle: row.tagtitle,
      pincode: row.pincode,
      nearbyPlaces: parseJSONField(row.nearbyPlaces),
    }));

    const result = await PropertyListing.insertMany(documents);

    res.status(200).json({
      message: `${result.length} properties inserted successfully`,
      data: result
    });
  } catch (error) {
    console.error("Bulk Insert Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  bulkInsertProperties,
};
