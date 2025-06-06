const PropertyListing = require('../model/PropertyListing');

const axios = require('axios');

const propertyfilter = async (req, res) => {
    try {
        const {
            country, state, city, title, subtitle,
            fromamout, propertylabel, propertyvalue,
            latitude, longitude, locationlable,
            locationvalue, locationvaluetitle,
            apartmenttitle, apartmentlable, apartmendescription,
            remotelocationtitle, remotelocationsubtitle,
            Currency, tagtitle, nearbyPlaces,
            pincode, developer
        } = req.query;

        // Build dynamic MongoDB query
        const query = {};

        if (country) query.country = country;
        if (state) query.state = state;
        if (city) query.city = city;
        if (title) query.title = { $regex: title, $options: 'i' };
        if (subtitle) query.subtitle = { $regex: subtitle, $options: 'i' };
        if (fromamout) query.fromamout = fromamout;
        if (propertylabel) query.propertylabel = propertylabel;
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

        const filteredProperties = await PropertyListing.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            message: "Properties fetched successfully",
            data: filteredProperties,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error fetching properties",
            error: error.message,
        });
    }
};




// ========== INSERT PROPERTY ==========
const PropertyListingInsert = async (req, res) => {
  try {
    const {
      country, state, city, title, subtitle, fromamout, propertylabel, propertyvalue,
      descriptiontitle, descriptionlabel, descriptionvalue, description, facilitieid,
      facilitiedescription, featureId, latitude, longitude, locationlable,
      locationvalue, locationvaluetitle, apartmenttitle, apartmentlable,
      apartmendescription, remotelocationtitle, remotelocationsubtitle,
      Currency, tagtitle, nearbyPlaces, pincode, developer
    } = req.body;

    const newListing = new PropertyListing({
      country, state, city, title, subtitle, fromamout, propertylabel, propertyvalue,
      descriptiontitle, descriptionlabel, descriptionvalue, description, facilitieid,
      facilitiedescription, featureId, latitude, longitude, locationlable,
      locationvalue, locationvaluetitle, apartmenttitle, apartmentlable,
      apartmendescription, remotelocationtitle, remotelocationsubtitle,
      Currency, tagtitle, nearbyPlaces, pincode, developer,
      createdAt: new Date()
    });

    if (req.files?.propertyimage) {
      newListing.propertyimageblobs = req.files.propertyimage.map(img => ({
        data: img.buffer,
        contentType: img.mimetype
      }));
      newListing.propertyimage = req.files.propertyimage.map(img => img.originalname).join(',');
    }

    if (req.files?.remotelocationimage) {
      newListing.remotelocationimageblobs = req.files.remotelocationimage.map(img => ({
        data: img.buffer,
        contentType: img.mimetype
      }));
      newListing.remotelocationimage = req.files.remotelocationimage.map(img => img.originalname).join(',');
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
    const page = parseInt(req.query.page) || 1;      // Current page (default 1)
    const limit = 3;                                // Always 10 per page
    const skip = (page - 1) * limit;

    const total = await PropertyListing.countDocuments(); // Total records

    const listings = await PropertyListing.find()
      .sort({ createdAt: -1 })    // Newest first
      .skip(skip)
      .limit(limit);              // Only 10 per page

    res.status(200).json({
      status: true,
      message: 'Property listings fetched successfully',
      data: listings,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching property listings:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch property listings',
      error: error.message,
    });
  }
};



// only one id get 
const getAllPropertyList = async (req, res) => {
  try {
    const latestProperty = await PropertyListing.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: 'Latest property listing fetched',
      data: latestProperty
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

    if (req.files?.propertyimage) {
      updatedData.propertyimageblobs = req.files.propertyimage.map(image => ({
        data: image.buffer,
        contentType: image.mimetype
      }));
      updatedData.propertyimage = req.files.propertyimage.map(img => img.originalname).join(',');
    }

    if (req.files?.remotelocationimage) {
      updatedData.remotelocationimageblobs = req.files.remotelocationimage.map(image => ({
        data: image.buffer,
        contentType: image.mimetype
      }));
      updatedData.remotelocationimage = req.files.remotelocationimage.map(img => img.originalname).join(',');
    }

    const updated = await PropertyListing.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updated) return res.status(404).json({ message: 'Property not found' });

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
      console.log('Property not found with ID:', req.params.id);
      return res.status(404).json({ status: false, message: 'Property not found' });
    }

    res.status(200).json({ status: true, message: 'Property deleted successfully' });

  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
  }
};


// ========== EXPORT ==========
module.exports = {
  PropertyListingInsert,
  getAllPropertyListings,
  updatePropertyListing,
  deletePropertyListing,
  getAllPropertyList,
  propertyfilter
};

