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

    // Handle multiple images
    if (req.files?.image) {
      newListing.images = req.files.image.map(file => ({
        data: file.buffer,
        contentType: file.mimetype
      }));
    }

    // Handle single remote location image
    if (req.files?.remotelocationimage?.[0]) {
      newListing.remotelocationimage = req.files.remotelocationimage[0].buffer;
      newListing.remotelocationimagetype = req.files.remotelocationimage[0].mimetype;
    }

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
