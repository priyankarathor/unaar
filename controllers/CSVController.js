// controllers/propertyController.js
const PropertyListing = require('../model/PropertyListing');

const axios = require('axios');

const insertProperty = async (req, res) => {
  try {
    console.log("REQ.BODY RECEIVED:", req.body);

    const body = { ...req.body };

    // Fix comma-separated fields
    if (typeof body.features === 'string') {
      body.features = body.features.split(',').map(item => item.trim());
    }

    if (typeof body.facilities === 'string') {
      body.facilities = body.facilities.split(',').map(item => item.trim());
    }

    if (typeof body.nearbyPlaces === 'string') {
      try {
        body.nearbyPlaces = JSON.parse(body.nearbyPlaces);
      } catch (e) {
        body.nearbyPlaces = body.nearbyPlaces.split(',').map(p => p.trim());
      }
    }

    // Convert numeric values
    if (body.price) body.price = Number(body.price);
    if (body.latitude) body.latitude = parseFloat(body.latitude);
    if (body.longitude) body.longitude = parseFloat(body.longitude);

    console.log("FINAL BODY TO INSERT:", body);

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
