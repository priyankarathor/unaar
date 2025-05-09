const mongoose = require('mongoose');

const propertyListing = new mongoose.Schema({

    subCategrory:{
        type: String
    },
    subtosubCategrory:{
        type: String
    },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },

    fromamout: String,
    propertylabel: String,
    propertyvalue: String,

    descriptiontitle: String,
    descriptionlabel: String,
    descriptionvalue: String,
    description: { type: String, required: true },

    facilitieid: String,
    facilitiedescription: String,


    featureId: String,

    latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      },
    locationlable: String,
    locationvalue: String,
    locationvaluetitle: String,

    data: {
        type: Date,
        default: Date.now
    },

    apartmenttitle: String,
    apartmentlable: String,
    apartmendescription: String,

    remotelocationtitle: String,
    remotelocationsubtitle: String,

    tagtitle: String,
    
    image: Buffer,
    imageType: String,

    remotelocationimage: Buffer,
    remotelocationimagetype: String,

    createdAt: {
    type: Date,
    default: Date.now
    }
});

module.exports = mongoose.model('PropertyListing', propertyListing);
