// controllers/propertyController.js
const PropertyListing = require('../model/PropertyListing');

const bulkInsertProperties = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Invalid data format. Expected array.' });
    }

    // Normalize and parse fields
    const propertiesToInsert = data.map(item => {
      const parseCSV = (val) => {
        return typeof val === 'string' ? val.split(',').map(i => i.trim()) : [];
      };

      return {
        propertyName: item.propertyName || '',
        description: item.description || '',
        price: Number(item.price) || 0,
        country: item.country || '',
        state: item.state || '',
        city: item.city || '',
        pincode: item.pincode || '',
        latitude: item.latitude || '',
        longitude: item.longitude || '',
        features: parseCSV(item.features),
        facilities: parseCSV(item.facilities),
        images: parseCSV(item.images),
        title: item.title || '',
        subtitle: item.subtitle || '',
        developer: item.developer || '',
        fromamout: item.fromamout || '',
        propertylabel: item.propertylabel || '',
        propertyvalue: item.propertyvalue || '',
        descriptiontitle: item.descriptiontitle || '',
        descriptionlabel: item.descriptionlabel || '',
        descriptionvalue: item.descriptionvalue || '',
        facilitieid: parseCSV(item.facilitieid),
        facilitiedescription: parseCSV(item.facilitiedescription),
        featureId: parseCSV(item.featureId),
        latitude_list: parseCSV(item.latitude_list),
        longitude_list: parseCSV(item.longitude_list),
        locationlable: parseCSV(item.locationlable),
        locationvalue: parseCSV(item.locationvalue),
        locationvaluetitle: parseCSV(item.locationvaluetitle),
        apartmenttitle: item.apartmenttitle || '',
        apartmentlable: parseCSV(item.apartmentlable),
        apartmendescription: parseCSV(item.apartmendescription),
        remotelocationtitle: item.remotelocationtitle || '',
        remotelocationsubtitle: item.remotelocationsubtitle || '',
        Currency: item.Currency || '',
        tagtitle: item.tagtitle || '',
        nearbyPlaces: parseCSV(item.nearbyPlaces), // optional field
      };
    });

    const inserted = await Property.insertMany(propertiesToInsert);
    res.status(200).json({ message: 'Bulk insert successful', insertedCount: inserted.length });
  } catch (err) {
    console.error('Error inserting properties:', err);
    res.status(500).json({ message: 'Bulk insert failed', error: err.message });
  }
};

module.exports = {
 bulkInsertProperties
};