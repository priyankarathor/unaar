const PropertyListing = require('../model/PropertyListing');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');

const upload = multer({ dest: 'uploads/' });

// Utility to fetch image as BLOB
// async function fetchImageBlob(url) {
//   try {
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     return {
//       data: Buffer.from(response.data),
//       contentType: response.headers['content-type']
//     };
//   } catch (err) {
//     console.error(`Failed to fetch image from ${url}:`, err.message);
//     return null;
//   }
// }

// ========== IMPORT CSV ==========

// const importCSV = [
//   upload.single('csvfile'),
//   async (req, res) => {
//     try {
//       const filePath = req.file.path;
//       const results = [];

//       await new Promise((resolve, reject) => {
//         fs.createReadStream(filePath)
//           .pipe(csv())
//           .on('data', (data) => results.push(data))
//           .on('end', resolve)
//           .on('error', reject);
//       });

//       const properties = await Promise.all(results.map(async (row) => {
//         let propertyimageblobs = [];
//         if (row.propertyimage) {
//           const urls = row.propertyimage.split(',').map(u => u.trim());
//           const blobs = await Promise.all(urls.map(fetchImageBlob));
//           propertyimageblobs = blobs.filter(Boolean);
//         }

//         let remotelocationimageblobs = [];
//         if (row.remotelocationimage) {
//           const urls = row.remotelocationimage.split(',').map(u => u.trim());
//           const blobs = await Promise.all(urls.map(fetchImageBlob));
//           remotelocationimageblobs = blobs.filter(Boolean);
//         }

//         return {
//           country: row.country || '',
//           state: row.state || '',
//           city: row.city || '',
//           title: row.title || '',
//           subtitle: row.subtitle || '',
//           developer: row.developer || '',
//           fromamout: parseFloat(row.fromamout) || 0,
//           propertylabel: row.propertylabel || '',
//           propertyvalue: row.propertyvalue || '',
//           descriptiontitle: row.descriptiontitle || '',
//           descriptionlabel: row.descriptionlabel || '',
//           descriptionvalue: row.descriptionvalue || '',
//           description: row.description || '',
//           facilitieid: row.facilitieid || '',
//           facilitiedescription: row.facilitiedescription || '',
//           featureId: row.featureId || '',
//           latitude: row.latitude || '',
//           longitude: row.longitude || '',
//           locationlable: row.locationlable || '',
//           locationvalue: row.locationvalue || '',
//           locationvaluetitle: row.locationvaluetitle || '',
//           apartmenttitle: row.apartmenttitle || '',
//           apartmentlable: row.apartmentlable || '',
//           apartmendescription: row.apartmendescription || '',
//           remotelocationtitle: row.remotelocationtitle || '',
//           remotelocationsubtitle: row.remotelocationsubtitle || '',
//           tagtitle: row.tagtitle || '',
//           Currency: row.Currency || '',
//           nearbyPlaces: row.nearbyPlaces || '',
//           pincode: row.pincode || '',
//           propertyimage: row.propertyimage || '',
//           remotelocationimage: row.remotelocationimage || '',
//           remotelocationimagetype: row.remotelocationimagetype || '',
//           propertyimageblobs,
//           remotelocationimageblobs,
//           createdAt: new Date()
//         };
//       }));

//       await PropertyListing.insertMany(properties);
//       fs.unlinkSync(filePath);

//       res.json({ success: true, message: 'CSV import successful', count: properties.length });

//     } catch (error) {
//       console.error('CSV Import Error:', error);
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }
// ];





const propertyfilter = async (req, res) => {
    try {
        const { country, state, city } = req.query;

        // Build a dynamic query object
        const query = {};
        if (country) query.country = country;
        if (state) query.state = state;
        if (city) query.city = city;

        const filteredProperties = await PropertyListing.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            status: true,
            message: "Properties fetched successfully",
            data: filteredProperties,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error fetching properties",
            error: error.message,
        });
    }
};


// ========== INSERT PROPERTY ==========
const PropertyListingInsert = async (req, res) => {
  try {
    const {
      country, state, city, title, subtitle, fromamout, propertylabel, propertyvalue,
      descriptiontitle, descriptionlabel, descriptionvalue, description, facilitieid,
      facilitiedescription, featureId, latitude, longitude, locationlable,
      locationvalue, locationvaluetitle, apartmenttitle, apartmentlable,
      apartmendescription, remotelocationtitle, remotelocationsubtitle,
      Currency, tagtitle, nearbyPlaces, pincode, developer
    } = req.body;

    const newListing = new PropertyListing({
      country, state, city, title, subtitle, fromamout, propertylabel, propertyvalue,
      descriptiontitle, descriptionlabel, descriptionvalue, description, facilitieid,
      facilitiedescription, featureId, latitude, longitude, locationlable,
      locationvalue, locationvaluetitle, apartmenttitle, apartmentlable,
      apartmendescription, remotelocationtitle, remotelocationsubtitle,
      Currency, tagtitle, nearbyPlaces, pincode, developer,
      createdAt: new Date()
    });

    if (req.files?.propertyimage) {
      newListing.propertyimageblobs = req.files.propertyimage.map(img => ({
        data: img.buffer,
        contentType: img.mimetype
      }));
      newListing.propertyimage = req.files.propertyimage.map(img => img.originalname).join(',');
    }

    if (req.files?.remotelocationimage) {
      newListing.remotelocationimageblobs = req.files.remotelocationimage.map(img => ({
        data: img.buffer,
        contentType: img.mimetype
      }));
      newListing.remotelocationimage = req.files.remotelocationimage.map(img => img.originalname).join(',');
    }

    const saved = await newListing.save();
    res.status(201).json({ message: 'Property listing created', data: saved });

  } catch (error) {
    console.error('Error inserting property:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ========== GET ALL ==========
const getAllPropertyListings = async (req, res) => {
  try {
    const listings = await PropertyListing.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: 'Property listings fetched',
      data: listings
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ status: false, message: 'Failed to fetch', error: error.message });
  }
};

// only one id get 
const getAllPropertyList = async (req, res) => {
  try {
    const latestProperty = await PropertyListing.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: 'Latest property listing fetched',
      data: latestProperty
    });
  } catch (error) {
    console.error('Error fetching latest property:', error);
    res.status(500).json({ status: false, message: 'Failed to fetch', error: error.message });
  }
};



// ========== UPDATE ==========
const updatePropertyListing = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.files?.propertyimage) {
      updatedData.propertyimageblobs = req.files.propertyimage.map(image => ({
        data: image.buffer,
        contentType: image.mimetype
      }));
      updatedData.propertyimage = req.files.propertyimage.map(img => img.originalname).join(',');
    }

    if (req.files?.remotelocationimage) {
      updatedData.remotelocationimageblobs = req.files.remotelocationimage.map(image => ({
        data: image.buffer,
        contentType: image.mimetype
      }));
      updatedData.remotelocationimage = req.files.remotelocationimage.map(img => img.originalname).join(',');
    }

    const updated = await PropertyListing.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updated) return res.status(404).json({ message: 'Property not found' });

    res.status(200).json({ message: 'Property updated successfully', data: updated });

  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ========== DELETE ==========
const deletePropertyListing = async (req, res) => {
  try {
    const deleted = await PropertyListing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Property not found' });

    res.status(200).json({ message: 'Property deleted successfully' });

  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ========== EXPORT ==========
module.exports = {
  PropertyListingInsert,
  getAllPropertyListings,
  updatePropertyListing,
  deletePropertyListing,
  getAllPropertyList,
  propertyfilter
};

