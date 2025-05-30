// controllers/propertyController.js
const PropertyListing = require('../model/PropertyListing');

const axios = require('axios');

const insertProperty = async (req, res) => {
  try {
    const body = req.body;

    // Log received fields
    console.log("Received body:", body);

    // If you’re expecting files:
    console.log("Files:", req.files);

    const property = new PropertyListing(body);
    const savedProperty = await property.save();

    res.status(201).json({
      message: "Property listing created successfully",
      data: savedProperty,
    });
  } catch (err) {
    console.error("Property insert error:", err); // Log full error
    res.status(500).json({
      message: "Failed to insert property",
      error: err.message,
    });
  }
};


module.exports = {
  insertProperty,
};
