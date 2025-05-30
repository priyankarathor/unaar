// controllers/propertyController.js
const PropertyListing = require('../model/PropertyListing');

const axios = require('axios');

const insertProperty = async (req, res) => {
  try {
    const body = { ...req.body };

    // Parse nearbyPlaces if it's a JSON string
    if (body.nearbyPlaces) {
      try {
        body.nearbyPlaces = JSON.parse(body.nearbyPlaces);
      } catch (e) {
        body.nearbyPlaces = [];
      }
    }

    if (body.price) {
      body.price = Number(body.price);
    }

    const property = new PropertyListing(body);
    const savedProperty = await property.save();

    return res.status(201).json({ message: 'Property inserted successfully', data: savedProperty });
  } catch (err) {
    console.error('Property insert error:', err);
    return res.status(500).json({ message: 'Failed to insert property', error: err.message });
  }
};

module.exports = {
  insertProperty,
};
