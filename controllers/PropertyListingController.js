const PropertyListing = require('../model/PropertyListing');
const multer = require('multer');

const PropertyListingInsert = async (req, res) => {
  try {
    const {
      subCategrory,
      subtosubCategrory,
      city,
      title,
      subtitle,
      fromamout,
      propertylabel,
      propertyvalue,
      descriptiontitle,
      descriptionlabel,
      descriptionvalue,
      description,
      facilitieid,
      facilitiedescription,
      featureId,
      latitude,
      longitude,
      locationlable,
      locationvalue,
      locationvaluetitle,
      apartmenttitle,
      apartmentlable,
      apartmendescription,
      remotelocationtitle,
      remotelocationsubtitle,
      tagtitle
    } = req.body;

    // Prepare property listing object
    const newListing = new PropertyListing({
      subCategrory,
      subtosubCategrory,
      city,
      title,
      subtitle,
      fromamout,
      propertylabel,
      propertyvalue,
      descriptiontitle,
      descriptionlabel,
      descriptionvalue,
      description,
      facilitieid,
      facilitiedescription,
      featureId,
      latitude,
      longitude,
      locationlable,
      locationvalue,
      locationvaluetitle,
      apartmenttitle,
      apartmentlable,
      apartmendescription,
      remotelocationtitle,
      remotelocationsubtitle,
      tagtitle,
      createdAt: new Date()
    });

    // Handle property images (store as Buffer + contentType)
    if (req.files?.propertyimage) {
      newListing.propertyimage = req.files.propertyimage.map(image => ({
        data: image.buffer,
        contentType: image.mimetype
      }));
    }

    // Handle single remote location image (store as Buffer + contentType)
    if (req.files?.remotelocationimage?.[0]) {
      const remoteImage = req.files.remotelocationimage[0];
      newListing.remotelocationimage = {
        data: remoteImage.buffer,
        contentType: remoteImage.mimetype
      };
    }

    // Save to database
    const savedListing = await newListing.save();
    res.status(201).json({
      message: 'Property listing created successfully',
      data: savedListing
    });
  } catch (error) {
    console.error('Error inserting property listing:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};



// Utility function to resolve proper content type
const getContentType = (input = '') => {
  const extensionMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
    ico: 'image/x-icon',
  };

  if (input.includes('/')) return input;
  const ext = input.split('.').pop().toLowerCase();
  return extensionMap[ext] || 'application/octet-stream';
};

// GET: Fetch all property listings
const getAllPropertyListings = async (req, res) => {
  try {
    const listings = await PropertyListing.find().sort({ createdAt: -1 });

    const formattedListings = listings.map(listing => {
      const propertyObj = listing.toObject();

      // Handle propertyimage
      if (typeof listing.propertyimage === 'string') {
        // Comma-separated base64 string
        const images = listing.propertyimage.split(',');
        propertyObj.propertyimage = images.map(base64Str => ({
          data: base64Str,
          contentType: getContentType('jpg'),
        }));
      } else if (Array.isArray(listing.propertyimage)) {
        // Array of { data, contentType } format
        propertyObj.propertyimage = listing.propertyimage.map(image => ({
          data: image?.data?.toString('base64') || '',
          contentType: getContentType(image?.contentType || 'jpg'),
        }));
      } else {
        // No images
        propertyObj.propertyimage = [];
      }

      // Handle remotelocationimage
      if (listing.remotelocationimage) {
        propertyObj.remotelocationimage = {
          data: listing.remotelocationimage.toString('base64'),
          contentType: getContentType(listing.remotelocationimagetype || 'jpg'),
        };
      } else {
        propertyObj.remotelocationimage = null;
      }

      return propertyObj;
    });

    res.status(200).json({
      status: true,
      message: 'Property listings fetched successfully',
      data: formattedListings,
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



// PUT: Update an existing property listing by ID
const updatePropertyListing = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    // Handle updated images if provided
    if (req.files?.propertyimage) {
      updatedData.propertyimage = req.files.propertyimage.map(image => ({
        data: image.buffer,
        contentType: image.mimetype
      }));
    }

    // Handle updated remote location image
    if (req.files?.remotelocationimage?.[0]) {
      const remoteLocationImage = req.files.remotelocationimage[0];
      updatedData.remotelocationimage = remoteLocationImage.buffer;
      updatedData.remotelocationimagetype = remoteLocationImage.mimetype;
    }

    const updated = await PropertyListing.findByIdAndUpdate(req.params.id, updatedData, {
      new: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Property listing not found' });
    }

    res.status(200).json({ message: 'Property listing updated successfully', data: updated });

  } catch (error) {
    console.error('Error updating property listing:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// DELETE: Delete a property listing by ID
const deletePropertyListing = async (req, res) => {
  try {
    const deleted = await PropertyListing.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Property listing not found' });
    }
    res.status(200).json({ message: 'Property listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting property listing:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Exporting all functions
module.exports = {
  PropertyListingInsert,
  getAllPropertyListings,
  updatePropertyListing,
  deletePropertyListing
};
