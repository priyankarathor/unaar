const PropertyListing = require('../model/PropertyListing');

exports.PropertyListingInsert = async (req, res) => {
  try {
    const {
      subCategrory,
      subtosubCategrory,
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

    const { files } = req;

    const newPropertyListing = new PropertyListing({
      subCategrory,
      subtosubCategrory,
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
      image: files?.image?.[0]?.buffer || null,
      imageType: files?.image?.[0]?.mimetype || null,
      remotelocationimage: files?.remotelocationimage?.[0]?.buffer || null,
      remotelocationimagetype: files?.remotelocationimage?.[0]?.mimetype || null,
    });

    await newPropertyListing.save();

    return res.status(201).json({
      success: true,
      message: 'Property listing inserted successfully.',
    });
  } catch (error) {
    console.error('Error inserting property listing:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message
    });
  }
};
