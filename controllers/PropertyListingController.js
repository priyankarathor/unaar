const PropertyListing = require('../model/PropertyListing');

// Insert property listing with images
exports.PropertyListingInsert = async (req, res) => {
  try {
    const { files } = req;

    // Construct the document with images
    const newPropertyListing = new PropertyListing({
      image: files?.image?.[0]?.buffer || null,
      imageType: files?.image?.[0]?.mimetype || null,

      facilitieimage: files?.facilitieimage?.[0]?.buffer || null,
      facilitieimagetype: files?.facilitieimage?.[0]?.mimetype || null,

      featureimage: files?.featureimage?.[0]?.buffer || null,
      featureimagetype: files?.featureimage?.[0]?.mimetype || null,

      remotelocationimage: files?.remotelocationimage?.[0]?.buffer || null,
      remotelocationimagetype: files?.remotelocationimage?.[0]?.mimetype || null,
    });

    // Save to database
    await newPropertyListing.save();

    // Return response
    return res.status(201).json({ success: true, message: 'Property listing with images inserted successfully.' });
  } catch (error) {
    console.error('Error inserting property listing:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
  }
};
