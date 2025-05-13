const PropertyListing = require('../model/PropertyListing');
const multer = require('multer');

// Utility function to get content type based on file extension
const getContentType = (filenameOrType) => {
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

  const ext = (filenameOrType || '').split('.').pop().toLowerCase();
  return extensionMap[ext] || 'application/octet-stream';
};

// POST: Insert a new property listing
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

    // Create a new property listing
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

    // Check if property images are uploaded (up to 5 images)
    if (req.files?.propertyimage) {
      newListing.propertyimage = req.files.propertyimage.map(image => ({
        data: image.buffer,
        contentType: image.mimetype
      }));
    }

    // Check if remote location image is uploaded
    if (req.files?.remotelocationimage?.[0]) {
      const remoteLocationImage = req.files.remotelocationimage[0];
      newListing.remotelocationimage = remoteLocationImage.buffer;
      newListing.remotelocationimagetype = remoteLocationImage.mimetype;
    }

    // Save the property listing to the database
    const saved = await newListing.save();
    res.status(201).json({ message: 'Property listing created successfully', data: saved });

  } catch (error) {
    console.error('Error inserting property listing:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// GET: Fetch all property listings
const getAllPropertyListings = async (req, res) => {
  try {
    const listings = await PropertyListing.find().sort({ createdAt: -1 });

    const formattedListings = listings.map(listing => ({
      ...listing.toObject(),

      // Format property images if they exist (up to 5 images)
      propertyimage: listing.propertyimage?.map(image => ({
        data: image.data.toString('base64'),
        contentType: getContentType(image.contentType || 'jpg')
      })) || [],

      // Format remote location image if it exists
      remotelocationimage: listing.remotelocationimage
        ? {
            data: listing.remotelocationimage.toString('base64'),
            contentType: getContentType(listing.remotelocationimagetype || 'jpg')
          }
        : null
    }));

    res.status(200).json({
      status: true,
      message: 'Property listings fetched successfully',
      data: formattedListings
    });

  } catch (error) {
    console.error('Error fetching property listings:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch property listings',
      error: error.message
    });
  }
};

// GET: Fetch a single property listing by ID
const getPropertyListingById = async (req, res) => {
  try {
    const listing = await PropertyListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Property listing not found' });
    }

    // Return the listing data, including property images (up to 5)
    res.status(200).json({
      status: true,
      message: 'Property listing fetched successfully',
      data: {
        ...listing.toObject(),
        propertyimage: listing.propertyimage || [],
        remotelocationimage: listing.remotelocationimage || null
      }
    });
  } catch (error) {
    console.error('Error fetching property listing by ID:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch property listing',
      error: error.message
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
  deletePropertyListing,
  getPropertyListingById
};
