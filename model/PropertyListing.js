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
  locationdescription:String,
  apartmenttitle: String,
  apartmentlable: String,
  apartmendescription: String,
  remotelocationtitle: String,
  remotelocationsubtitle: String,
  tagtitle: String,
  Currency: String,
  nearbyPlaces: String,
  pincode: String,
  growthrate : String,
  loginId:String,
  status:String,
   developer: String,
   type:String,

  // Property images
  propertyimageblobs: [imageSchema],  // array of image BLOBs
  propertyimage: String,              // CSV filenames

  // Remote location images
  remotelocationimageblobs: [imageSchema],  // changed from single to array
  remotelocationimage: String,              // new: CSV filenames

  remotelocationimagetype: {
    type: String // optional: MIME type for the image set
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PropertyListingschma', propertyListing);
