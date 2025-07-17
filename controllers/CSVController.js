const Property = require('../model/PropertyListing');
const csv = require('csvtojson');
const { Parser } = require('json2csv');

// List of fields for CSV
const fields = [
  'country', 'state', 'city', 'title', 'subtitle', 'fromamout', 'propertylabel', 'propertyvalue',
  'descriptiontitle', 'descriptionlabel', 'descriptionvalue', 'description', 'facilitieid',
  'facilitiedescription', 'featureId', 'latitude', 'longitude', 'locationlable', 'locationvalue',
  'locationvaluetitle', 'locationdescription', 'apartmenttitle', 'apartmentlable',
  'apartmendescription', 'remotelocationtitle', 'remotelocationsubtitle', 'tagtitle', 'Currency',
  'pincode', 'growthrate', 'loginId', 'status', 'developer', 'type', 'propertyimage', 'remotelocationimage'
];

// ========== Download CSV Template ==========
exports.downloadCsvTemplate = (req, res) => {
  try {
    const parser = new Parser({ fields });
    const csvData = parser.parse([]);

    res.header('Content-Type', 'text/csv');
    res.attachment('property_template.csv');
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ message: 'CSV generation failed', error: error.message });
  }
};

// ========== Bulk Insert from CSV ==========
exports.bulkInsertFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const jsonArray = await csv().fromString(req.file.buffer.toString());

    // Optional: validate fields here
    const inserted = await Property.insertMany(jsonArray);
    res.status(200).json({ message: 'Bulk insert successful', data: inserted });
  } catch (error) {
    res.status(500).json({ message: 'Bulk insert failed', error: error.message });
  }
};
