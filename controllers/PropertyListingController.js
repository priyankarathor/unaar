const PropertyListing = require('../model/PropertyListing');

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

    // Check if images are uploaded
    if (req.files?.images) {
      newListing.images = req.files.images.map(file => ({
        data: file.buffer,
        contentType: file.mimetype
      }));
    }

    // Handle remote location image if uploaded
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

module.exports = {
  PropertyListingInsert
};
