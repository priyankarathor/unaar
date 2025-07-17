const PropertyListing = require('../model/PropertyListing');
const PropertyBanner = require('../model/propertybanner');


const PropertyListingInsert = async (req, res) => {
  try {
    const {
      country, state, city, title, subtitle, fromamout, propertylabel, propertyvalue,
      descriptiontitle, descriptionlabel, descriptionvalue, description, facilitieid,
      facilitiedescription, featureId, latitude, longitude, locationlable, growthrate,
      locationvalue, locationvaluetitle, locationdescription, apartmenttitle, apartmentlable,
      apartmendescription, remotelocationtitle, remotelocationsubtitle,
      Currency, tagtitle, nearbyPlaces, pincode, developer, loginId, status, type
    } = req.body;

    const newListing = new PropertyListing({
      country, state, city, title, subtitle, fromamout, propertylabel, propertyvalue,
      descriptiontitle, descriptionlabel, descriptionvalue, description, facilitieid,
      facilitiedescription, featureId, latitude, longitude, locationlable, growthrate,
      locationvalue, locationvaluetitle, locationdescription, apartmenttitle, apartmentlable,
      apartmendescription, remotelocationtitle, remotelocationsubtitle,
      Currency, tagtitle, nearbyPlaces, pincode, developer, loginId, status, type,
      createdAt: new Date()
    });

    // ✅ Ensure req.files exists and log it for debugging
    console.log('Uploaded files:', req.files);

    // ✅ Save full URLs of uploaded property images
    if (req.files?.propertyimage?.length > 0) {
      newListing.propertyimage = req.files.propertyimage
        .filter(img => img?.filename)
        .map(img => `${req.protocol}://${req.get('host')}/uploads/${img.filename}`)
        .join(',');
    }

    // ✅ Save full URLs of uploaded remote location images
    if (req.files?.remotelocationimage?.length > 0) {
      newListing.remotelocationimage = req.files.remotelocationimage
        .filter(img => img?.filename)
        .map(img => `${req.protocol}://${req.get('host')}/uploads/${img.filename}`)
        .join(',');
    }

    const saved = await newListing.save();
    res.status(201).json({ message: 'Property listing created', data: saved });

  } catch (error) {
    console.error('Error inserting property:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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

// ========== UPDATE ==========
const updatePropertyListing = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    // ✅ Update image URLs
    if (req.files?.propertyimage) {
      updatedData.propertyimage = req.files.propertyimage.map(img =>
        `${req.protocol}://${req.get('host')}/uploads/${img.filename}`
      ).join(',');
    }

    if (req.files?.remotelocationimage) {
      updatedData.remotelocationimage = req.files.remotelocationimage.map(img =>
        `${req.protocol}://${req.get('host')}/uploads/${img.filename}`
      ).join(',');
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

// ========== EXPORT ==========
module.exports = {
  PropertyListingInsert,
  getAllPropertyListings,
  updatePropertyListing,
  deletePropertyListing,
  getAllPropertyList,
  propertyfilter,
  propertyfilterBanner
};
