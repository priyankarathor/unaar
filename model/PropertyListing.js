const mongoose = require('mongoose');

const propertyListing = new mongoose.Schema({
    category: String,
    subcategory: String,
    subtosubcategory: String,

    title: { type: String, required: true },
    subtitle: { type: String, required: true },

    fromamout: String,
    propertylabel: String,
    propertyvalue: String,

    descriptiontitle: String,
    descriptionlabel: String,
    descriptionvalue: String,
    description: { type: String, required: true },

    facilitietitle: String,
    facilitieimage: Buffer,
    facilitieimagetype: String,
    facilitievalue: String,
    facilitiedescription: String,

    featuretitle: String,
    featureimage: Buffer,
    featureimagetype: String,

    locationtitle: String,
    locationsubtitle: String,
    locationlable: String,
    locationvalue: String,
    locationvaluetitle: String,

    image: Buffer,
    imageType: String,

    data: {
        type: Date,
        default: Date.now
    },

    apartmenttitle: String,
    apartmentlable: String,
    apartmendescription: String,

    remotelocationtitle: String,
    remotelocationimage: Buffer,
    remotelocationimagetype: String,
    remotelocationsubtitle: String,

    tagtitle: String
});

module.exports = mongoose.model('PropertyListing', propertyListing);
