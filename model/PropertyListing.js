const mongoose = require('mongoose');

const propertyListing = new mongoose.Schema({
  subCategrory: String,
  subtosubCategrory: String,
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

  // Store property images as an array of Buffers (BLOBs)
  propertyimage: [
  {
    data: Buffer,
    contentType: String
  }
],
  remotelocationimage: {
    data: Buffer,
    contentType: String
  },
  
  remotelocationimagetype: {
    type: String // MIME type for the image, e.g., 'image/jpeg'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PropertyListingschma', propertyListing);
