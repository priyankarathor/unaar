const PropertyListing = require('../model/PropertyListing');

exports.PropertyListingInsert = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;

    const parseArray = (key) => data[key] ? data[key].split(',') : [];

    const images = files?.image?.map(file => ({
      data: file.buffer,
      contentType: file.mimetype
    })) || [];

    // Process single remotelocation image
    const remoteLocationImage = files?.remotelocationimage?.[0]
      ? {
          data: files.remotelocationimage[0].buffer,
          contentType: files.remotelocationimage[0].mimetype
        }
      : null;

    const newPropertyListing = new PropertyListing({
      subCategrory: data.subCategrory,
      subtosubCategrory: data.subtosubCategrory,
      city: data.city,
      title: data.title,
      subtitle: data.subtitle,
      fromamout: data.fromamout,
      propertylabel: parseArray('propertylabel'),
      propertyvalue: parseArray('propertyvalue'),
      descriptiontitle: data.descriptiontitle,
      descriptionlabel: parseArray('descriptionlabel'),
      descriptionvalue: parseArray('descriptionvalue'),
      description: data.description,
      facilitieid: parseArray('facilitieid'),
      facilitiedescription: data.facilitiedescription,
      featureId: parseArray('featureId'),
      latitude: data.latitude,
      longitude: data.longitude,
      locationlable: parseArray('locationlable'),
      locationvalue: parseArray('locationvalue'),
      locationvaluetitle: data.locationvaluetitle,
      apartmenttitle: data.apartmenttitle,
      apartmentlable: data.apartmentlable,
      apartmendescription: data.apartmendescription,
      remotelocationtitle: data.remotelocationtitle,
      remotelocationsubtitle: data.remotelocationsubtitle,
      tagtitle: data.tagtitle,
      images,
      remotelocationimage: remoteLocationImage
    });

    await newPropertyListing.save();

    return res.status(201).json({
      success: true,
      message: 'Property listing inserted successfully.',
      data: newPropertyListing
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
