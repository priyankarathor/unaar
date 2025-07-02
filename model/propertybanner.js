const mongoose = require("mongoose");

const propertyBannerSchema = new mongoose.Schema({
    tag: String,
    buttontag: String,
    categoryProperty: String,
    location: String,
    latitude: String,
    longitude: String,
    country: String,
    city: String,
    state: String,
    locationlabel: String, // fixed typo from "loactionlabal"
    propertyId: String,
    developerId: String, // fixed typo from "DeleoperId"
    adverticesvalue: String,
    adverticestext: String,
    bannertype: String,
    image: Buffer,
    imageType: String
}, { timestamps: true });

module.exports = mongoose.model("PropertyBanner", propertyBannerSchema);
