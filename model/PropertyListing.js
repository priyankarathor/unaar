const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
}, { _id: false });


const propertyListing = new mongoose.Schema({
     country: String,
      state: String,
  city: String,
  title: String,
  subtitle: String,
  fromamout: Number,
  propertylabel: String,
  propertyvalue: String,
  descriptiontitle: String,
  descriptionlabel: String,
  descriptionvalue: String,
  description: String,
  facilitieid: String,
  facilitiedescription: String,
  featureId: String,
  latitude: String,
  longitude: String,
  locationlable: String,
  locationvalue: String,
  locationvaluetitle: String,
  apartmenttitle: String,
  apartmentlable: String,
  apartmendescription: String,
  remotelocationtitle: String,
  remotelocationsubtitle: String,
  tagtitle: String,

  Currency:String,

  // Store property images as an array of Buffers (BLOBs)
  
    // BLOB image array
  propertyimageblobs: [imageSchema],  // stores image buffers
  propertyimage: String,              // optional: stores image filenames as CSV

  // Single BLOB image
  remotelocationimage: imageSchema,

  remotelocationimagetype: {
    type: String // MIME type for the image, e.g., 'image/jpeg'
  },


  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PropertyListingschma', propertyListing);
