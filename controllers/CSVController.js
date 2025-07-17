// routes/csvRoutes.js

const Property = require('../model/PropertyListing'); // Your Mongoose model


const bulkPropertyInsert = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    const formatted = data.map(item => ({
          country: row.country,
      state: row.state,
      city: row.city,
      title: row.title,
      subtitle: row.subtitle || 'Residential',
      developer: row.developer,
      fromamout: row.fromamout,
      type: row.type,
      growthrate: row.growthrate,
      loginId: row.loginId,
      status: row.status || 'Pending',
      propertylabel: item.propertylabel?.split(',') || [],
      propertyvalue: item.propertyvalue?.split(',') || [],
      descriptionlabel: item.descriptionlabel?.split(',') || [],
      descriptionvalue: item.descriptionvalue?.split(',') || [],
      facilitieid: item.facilitieid?.split(',') || [],
      featureId: item.featureId?.split(',') || [],
      latitude: item.latitude?.split(',') || [],
      longitude: item.longitude?.split(',') || [],
      locationlable: item.locationlable?.split(',') || [],
      locationvalue: item.locationvalue?.split(',') || [],
      apartmentlable: item.apartmentlable?.split(',') || [],
      apartmendescription: item.apartmendescription?.split(',') || [],
      remotelocationtitle: item.remotelocationtitle?.split(',') || [],
      remotelocationsubtitle: item.remotelocationsubtitle?.split(',') || [],
      nearbyPlaces: item.nearbyPlaces?.split(',') || [],
    }));

    const inserted = await Property.insertMany(formatted);
    res.status(201).json({ message: 'Data inserted successfully', insertedCount: inserted.length });
  } catch (error) {
    console.error('Insert Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = { bulkPropertyInsert };
