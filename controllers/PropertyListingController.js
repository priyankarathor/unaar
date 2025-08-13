require("dotenv").config();
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const PropertyListing = require("../model/PropertyListing");
const PropertyBanner = require("../model/propertybanner");

// configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
  region: process.env.AWS_REGION?.trim(),
});
const s3 = new AWS.S3();

const uploadToS3 = async (file) => {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const result = await s3.upload(params).promise();
  return result.Location; // public URL
};

/**
 * Create property listing (uploads images to S3)
 * Expected fields:
 * - propertyimage (files, max 5)
 * - remotelocationimage (files, max 5)
 */
const propertyListingInsert = async (req, res) => {
  try {
    // parse fields from req.body (they are strings from form-data)
    const body = req.body;

    // Validate file counts
    if (req.files?.propertyimage && req.files.propertyimage.length > 5) {
      return res.status(400).json({ message: "Max 5 images allowed for propertyimage" });
    }
    if (req.files?.remotelocationimage && req.files.remotelocationimage.length > 5) {
      return res.status(400).json({ message: "Max 5 images allowed for remotelocationimage" });
    }

    // Upload property images
    let propertyImageUrls = [];
    if (req.files?.propertyimage?.length) {
      propertyImageUrls = await Promise.all(req.files.propertyimage.map(uploadToS3));
    }

    // Upload remote location images
    let remoteLocationImageUrls = [];
    if (req.files?.remotelocationimage?.length) {
      remoteLocationImageUrls = await Promise.all(req.files.remotelocationimage.map(uploadToS3));
    }

    const newListing = new PropertyListing({
      country: body.country,
      state: body.state,
      city: body.city,
      title: body.title,
      subtitle: body.subtitle,
      fromamout: body.fromamout,
      propertylabel: body.propertylabel,
      propertyvalue: body.propertyvalue,
      descriptiontitle: body.descriptiontitle,
      descriptionlabel: body.descriptionlabel,
      descriptionvalue: body.descriptionvalue,
      description: body.description,
      facilitieid: body.facilitieid,
      facilitiedescription: body.facilitiedescription,
      featureId: body.featureId,
      latitude: body.latitude,
      longitude: body.longitude,
      locationlable: body.locationlable,
      locationvalue: body.locationvalue,
      locationvaluetitle: body.locationvaluetitle,
      locationdescription: body.locationdescription,
      apartmenttitle: body.apartmenttitle,
      apartmentlable: body.apartmentlable,
      apartmendescription: body.apartmendescription,
      remotelocationtitle: body.remotelocationtitle,
      remotelocationsubtitle: body.remotelocationsubtitle,
      tagtitle: body.tagtitle,
      Currency: body.Currency,
      nearbyPlaces: body.nearbyPlaces,
      pincode: body.pincode,
      growthrate: body.growthrate,
      loginId: body.loginId,
      status: body.status,
      developer: body.developer,
      type: body.type,
      propertyimage: propertyImageUrls,
      remotelocationimage: remoteLocationImageUrls,
    });

    const saved = await newListing.save();
    return res.status(201).json({ status: true, message: "Property created", data: saved });
  } catch (error) {
    console.error("Error inserting property:", error);
    return res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};


// ========== GET ALL ==========
const getAllPropertyListings = async (req, res) => {
  try {
    const listings = await PropertyListing.find().sort({ createdAt: -1 });

    const formatted = listings.map(p => ({
      ...p._doc,
      propertyimage: Array.isArray(p.propertyimage)
        ? p.propertyimage
        : (p.propertyimage?.split(',') || []),
      remotelocationimage: Array.isArray(p.remotelocationimage)
        ? p.remotelocationimage
        : (p.remotelocationimage?.split(',') || []),
    }));

    res.status(200).json({
      status: true,
      message: 'Latest property listings fetched',
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch',
      error: error.message,
    });
  }
};


// ========== GET ONE ==========
const getAllPropertyList = async (req, res) => {
  try {
    const latestProperty = await PropertyListing.findOne().sort({ createdAt: -1 });

    const formatted = {
      ...latestProperty._doc,
      propertyimage: latestProperty.propertyimage?.split(',') || [],
      remotelocationimage: latestProperty.remotelocationimage?.split(',') || []
    };

    res.status(200).json({
      status: true,
      message: 'Latest property listing fetched',
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching latest property:', error);
    res.status(500).json({ status: false, message: 'Failed to fetch', error: error.message });
  }
};



// ========== DELETE ==========
const deletePropertyListing = async (req, res) => {
  try {
    const deleted = await PropertyListing.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: false, message: 'Property not found' });
    }

    res.status(200).json({ status: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
  }
};

// ========== FILTER ==========
const propertyfilter = async (req, res) => {
  try {
    const {
      country, state, city, title, subtitle, fromamout, propertylabel, propertyvalue,
      latitude, longitude, locationlable, locationvalue, locationvaluetitle,
      apartmenttitle, apartmentlable, apartmendescription, remotelocationtitle,
      remotelocationsubtitle, Currency, tagtitle, nearbyPlaces, pincode,
      developer, type, minPrice, maxPrice
    } = req.query;

    const query = {};

    if (country) query.country = country;
    if (state) query.state = state;
    if (city) query.city = city;
    if (title) query.title = { $regex: title, $options: 'i' };
    if (subtitle) query.subtitle = { $regex: subtitle, $options: 'i' };

    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!isNaN(min) || !isNaN(max)) {
      query.fromamout = {};
      if (!isNaN(min)) query.fromamout.$gte = min;
      if (!isNaN(max)) query.fromamout.$lte = max;
    }

    if (propertylabel) query.propertylabel = { $regex: propertylabel, $options: 'i' };
    if (propertyvalue) query.propertyvalue = propertyvalue;
    if (latitude) query.latitude = latitude;
    if (longitude) query.longitude = longitude;
    if (locationlable) query.locationlable = { $regex: locationlable, $options: 'i' };
    if (locationvalue) query.locationvalue = locationvalue;
    if (locationvaluetitle) query.locationvaluetitle = locationvaluetitle;
    if (apartmenttitle) query.apartmenttitle = apartmenttitle;
    if (apartmentlable) query.apartmentlable = apartmentlable;
    if (apartmendescription) query.apartmendescription = { $regex: apartmendescription, $options: 'i' };
    if (remotelocationtitle) query.remotelocationtitle = remotelocationtitle;
    if (remotelocationsubtitle) query.remotelocationsubtitle = remotelocationsubtitle;
    if (Currency) query.Currency = Currency;
    if (tagtitle) query.tagtitle = tagtitle;
    if (nearbyPlaces) query.nearbyPlaces = { $regex: nearbyPlaces, $options: 'i' };
    if (pincode) query.pincode = pincode;
    if (developer) query.developer = developer;
    if (type) query.type = type;

    const filteredProperties = await PropertyListing.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: 'Properties fetched successfully',
      data: filteredProperties
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// ========== PROPERTY BANNER FILTER ==========
const propertyfilterBanner = async (req, res) => {
  try {
    const { country, categoryProperty } = req.query;

    const query = {};
    if (country) query.country = country;
    if (categoryProperty) query.categoryProperty = categoryProperty;

    const banners = await PropertyBanner.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: 'Banners fetched successfully',
      data: { banners }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
};


//========CSV import=====
const parseJSONField = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};





// GET property by ID
const getPropertyById = async (req, res) => {
  try {
    const property = await PropertyListing.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const updatePropertyListing = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    const fieldsToParse = [
      'country', 'state', 'city', 'title', 'subtitle', 'fromamout',
      'propertylabel', 'propertyvalue', 'descriptiontitle', 'descriptionlabel',
      'descriptionvalue', 'description', 'facilitieid', 'facilitiedescription',
      'featureId', 'latitude', 'longitude', 'locationlable', 'growthrate',
      'locationvalue', 'locationvaluetitle', 'locationdescription',
      'apartmenttitle', 'apartmentlable', 'apartmendescription',
      'remotelocationtitle', 'remotelocationsubtitle', 'Currency', 'tagtitle',
      'pincode', 'developer', 'loginId', 'status', 'type'
    ];

    const safeJsonParse = (value) => {
      if (!value) return undefined;
      if (typeof value === 'object') return value;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    };

    fieldsToParse.forEach(field => {
      if (updatedData[field] !== undefined) {
        updatedData[field] = safeJsonParse(updatedData[field]);
      }
    });

    // Convert comma-separated strings to arrays for these fields if needed
    ['propertylabel', 'propertyvalue'].forEach(field => {
      if (updatedData[field] && !Array.isArray(updatedData[field])) {
        updatedData[field] = updatedData[field].toString().split(',').map(s => s.trim());
      }
    });

    // If files uploaded, override images with new S3 URLs
    if (req.files?.propertyimage) {
      updatedData.propertyimage = req.files.propertyimage.map(file => file.location);
    }

    if (req.files?.remotelocationimage) {
      updatedData.remotelocationimage = req.files.remotelocationimage.map(file => file.location);
    }

    // Otherwise, keep existing image arrays from req.body as arrays (parse if string)
    if (!updatedData.propertyimage) {
      if (req.body.propertyimage && typeof req.body.propertyimage === 'string') {
        updatedData.propertyimage = req.body.propertyimage.split(',').map(s => s.trim());
      }
    }

    if (!updatedData.remotelocationimage) {
      if (req.body.remotelocationimage && typeof req.body.remotelocationimage === 'string') {
        updatedData.remotelocationimage = req.body.remotelocationimage.split(',').map(s => s.trim());
      }
    }

    const updated = await PropertyListing.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Property updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// ========== EXPORT ==========
module.exports = {
  propertyListingInsert,
  getAllPropertyListings,
  deletePropertyListing,
  getAllPropertyList,
  propertyfilter,
  propertyfilterBanner,
  updatePropertyListing,
  getPropertyById
};
