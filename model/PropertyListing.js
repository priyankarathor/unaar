const mongoose = require('mongoose');

const propertyListing = new mongoose.Schema({
  image: Buffer,
  imageType: String,

  facilitieimage: Buffer,
  facilitieimagetype: String,

  featureimage: Buffer,
  featureimagetype: String,

  remotelocationimage: Buffer,
  remotelocationimagetype: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PropertyListing', propertyListing);
