const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

const propertyListingSchema = new mongoose.Schema({
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

  images: [imageSchema],
  propertyimage: Buffer,
  propertyimageType: String,
  remotelocationimage: Buffer,
  remotelocationimagetype: String,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PropertyListing', propertyListingSchema);
