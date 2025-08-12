const mongoose = require("mongoose");

const propertyListingSchema = new mongoose.Schema({
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
  locationdescription: String,
  apartmenttitle: String,
  apartmentlable: String,
  apartmendescription: String,
  remotelocationtitle: String,
  remotelocationsubtitle: String,
  tagtitle: String,
  Currency: String,
  nearbyPlaces: String,
  pincode: String,
  growthrate: String,
  loginId: String,
  status: String,
  developer: String,
  type: String,

  // images stored as arrays of S3 URLs
  propertyimage: { type: [String], default: [] },
  remotelocationimage: { type: [String], default: [] },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PropertyListing", propertyListingSchema);
