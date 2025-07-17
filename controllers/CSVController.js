// controllers/propertyController.js
const PropertyListing = require('../model/PropertyListing');

const axios = require('axios');

const insertProperty = async (req, res) => {
  try {
    const body = { ...req.body };

    // Fix comma-separated string fields into arrays
    if (typeof body.features === 'string') {
      body.features = body.features.split(',').map(item => item.trim());
    }

    if (typeof body.facilities === 'string') {
      body.facilities = body.facilities.split(',').map(item => item.trim());
    }

    if (typeof body.nearbyPlaces === 'string') {
      try {
        body.nearbyPlaces = JSON.parse(body.nearbyPlaces);
      } catch {
        body.nearbyPlaces = body.nearbyPlaces.split(',').map(p => p.trim());
      }
    }

    // Convert numbers if necessary
    if (typeof body.price === 'string') {
      body.price = Number(body.price);
    }

    if (typeof body.latitude === 'string') {
      body.latitude = parseFloat(body.latitude);
    }

    if (typeof body.longitude === 'string') {
      body.longitude = parseFloat(body.longitude);
    }

    // Now insert clean body into DB
    const property = new PropertyListing(body);
    const savedProperty = await property.save();

    res.status(201).json({
      message: "Property listing created successfully",
      data: savedProperty,
    });
  } catch (err) {
    console.error("Property insert error:", err);
    res.status(500).json({
      message: "Failed to insert property",
      error: err.message,
    });
  }
};



module.exports = {
  insertProperty,
};
