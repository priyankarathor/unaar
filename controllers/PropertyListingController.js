const PropertyListing = require('../model/PropertyListing');
const PropertyBanner = require("../model/propertybanner");

const axios = require('axios');

// Property filter 
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
            pincode, developer, type,
            minPrice, maxPrice
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

        if (propertylabel) {
            query.propertylabel = { $regex: propertylabel, $options: 'i' };
        }

        if (propertyvalue) query.propertyvalue = propertyvalue;
        if (latitude) query.latitude = latitude;
        if (longitude) query.longitude = longitude;

        // ✅ Normalize locationlable using $where (safe fallback for now)
        if (locationlable) {
            const normalizedInput = locationlable.toLowerCase().replace(/[^a-z0-9]/gi, '');
            query.$where = function () {
                const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9]/gi, '');
                return normalize(this.locationlable) === normalizedInput;
            };
        }

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

        console.log('Final Query:', query);

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




// property banner filter property data
const propertyfilterBanner = async (req, res) => {
    try {
        const {
            country, state, city, title, subtitle,
            latitude, longitude, locationlable,
            locationvalue, locationvaluetitle
        } = req.query;

        // Build dynamic MongoDB query for PropertyListing
        const query = {};

        if (country) query.country = country;
        if (state) query.state = state;
        if (city) query.city = city;
        if (subtitle) query.subtitle = { $regex: subtitle, $options: 'i' };
        if (latitude) query.latitude = latitude;
        if (longitude) query.longitude = longitude;
        if (locationlable) query.locationlable = { $regex: locationlable, $options: 'i' };
        if (locationvalue) query.locationvalue = locationvalue;
        if (locationvaluetitle) query.locationvaluetitle = locationvaluetitle;

        // Step 1: Get matched properties
        const filteredProperties = await PropertyListing.find(query).sort({ createdAt: -1 });

        // Step 2: Extract values from matched properties
        const locationValues = filteredProperties.map(p => p.locationvalue).filter(Boolean);
        const latitudes = filteredProperties.map(p => p.latitude).filter(Boolean);
        const longitudes = filteredProperties.map(p => p.longitude).filter(Boolean);
        const locationLabels = filteredProperties.map(p => p.locationlable).filter(Boolean);
        const subtitles = filteredProperties.map(p => p.subtitle).filter(Boolean);

        // Step 3: Find banners that match any of those values
        const matchedBanners = await PropertyBanner.find({
            $or: [
                { loactionlabal: { $in: locationValues } },
                { latitude: { $in: latitudes } },
                { longitude: { $in: longitudes } },
                { locationlable: { $in: locationLabels } },
                { categoryProperty: { $in: subtitles } }
            ]
        }).sort({ createdAt: -1 });

        // Step 4: Send response
        res.status(200).json({
            status: true,
            message: "Properties and matching banners fetched successfully",
            data: {
                properties: filteredProperties,
                banners: matchedBanners
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error fetching data",
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
      locationvalue, locationvaluetitle, locationdescription, apartmenttitle, apartmentlable,
      apartmendescription, remotelocationtitle, remotelocationsubtitle,
      Currency, tagtitle, nearbyPlaces, pincode, developer, type
    } = req.body;

    const newListing = new PropertyListing({
      country, state, city, title, subtitle, fromamout, propertylabel, propertyvalue,
      descriptiontitle, descriptionlabel, descriptionvalue, description, facilitieid,
      facilitiedescription, featureId, latitude, longitude, locationlable,
      locationvalue, locationvaluetitle, apartmenttitle, locationdescription, apartmentlable,
      apartmendescription, remotelocationtitle, remotelocationsubtitle,
      Currency, tagtitle, nearbyPlaces, pincode, developer, type,
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
// const getAllPropertyListings = async (req, res) => {
//   try {
//     // Get the requested page number from query parameters (default is 1)
//     const page = parseInt(req.query.page) || 1;

//     // Limit of listings per page
//     const limit = 10;

//     // Calculate how many documents to skip
//     const skip = (page - 1) * limit;

//     // Get the total number of property listings
//     const totalItems = await PropertyListing.countDocuments();

//     // Get the listings for the current page, sorted by newest first
//     const listings = await PropertyListing.find()
//       .sort({ createdAt: -1 }) // Sort by most recent
//       .skip(skip)
//       .limit(limit);

//     // Calculate total pages
//     const totalPages = Math.ceil(totalItems / limit);

//     // Prepare pagination metadata
//     const pagination = {
//       totalItems,
//       currentPage: page,
//       totalPages,
//       itemsPerPage: limit,
//       hasNextPage: page < totalPages,
//       hasPrevPage: page > 1,
//     };

//     // Return response with data and pagination
//     res.status(200).json({
//       status: true,
//       message: 'Property listings fetched successfully',
//       data: listings,
//       pagination,
//     });

//   } catch (error) {
//     console.error('Error fetching property listings:', error);

//     // Return error response
//     res.status(500).json({
//       status: false,
//       message: 'Failed to fetch property listings',
//       error: error.message,
//     });
//   }
// };

// Controller to fetch all property listings from the database
const getAllPropertyListings = async (req, res) => {
  try {
    // Fetch all listings from the database, sorted by creation date (latest first)
    const listings = await PropertyListing.find().sort({ createdAt: -1 });

    // Format each listing for the response
    const formattedListings = listings.map(listing => ({
      _id: listing._id,
      country: listing.country,
      state: listing.state,
      city: listing.city,
      pincode: listing.pincode,
      title: listing.title,
      subtitle: listing.subtitle,
      fromamount: listing.fromamount,
      propertylabel: listing.propertylabel,
      propertyvalue: listing.propertyvalue,
      descriptiontitle: listing.descriptiontitle,
      descriptionlabel: listing.descriptionlabel,
      descriptionvalue: listing.descriptionvalue,
      description: listing.description,
      facilitieid: listing.facilitieid,
      facilitiedescription: listing.facilitiedescription,
      featureId: listing.featureId,
      latitude: listing.latitude,
      longitude: listing.longitude,
      locationlable: listing.locationlable,
      locationvalue: listing.locationvalue,
      locationvaluetitle: listing.locationvaluetitle,
      apartmenttitle: listing.apartmenttitle,
      apartmentlable: listing.apartmentlable,
      apartmendescription: listing.apartmendescription,
      remotelocationtitle: listing.remotelocationtitle,
      remotelocationsubtitle: listing.remotelocationsubtitle,
      Currency: listing.Currency,
      tagtitle: listing.tagtitle,
      nearbyPlaces: listing.nearbyPlaces,
      developer: listing.developer,
      type: listing.type,

      // Return image as a buffer and include its MIME type if present
      image: listing.image
        ? {
            data: listing.image,
            contentType: listing.imageType || "image/jpeg",
          }
        : null,

      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    }));

    // Send success response with all formatted listings
    res.status(200).json({
      status: true,
      message: "Property listings fetched successfully",
      data: formattedListings,
    });
  } catch (error) {
    // Log and return error if the fetch fails
    console.error("Error fetching property listings:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch property listings",
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
  propertyfilter,
  propertyfilterBanner
};