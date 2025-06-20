const mongoose = require("mongoose");

const propertybannerSchematab = new mongoose.Schema({
    tag:String,
    buttontag: String,
    categoryProperty:String,
    location: String,
    latitude: String,
    longitude: String,
    country: String,
    city :String,
    state:String,
    loactionlabal: String,
    propertyId : String,
    developerId : String,
    adverticesvalue : String,
    adverticestext : String,
    image: Buffer,
    imageType : String ,
    bannertype :String

}, { timestamps: true });

module.exports = mongoose.model("propertybannerSchema", propertybannerSchematab);
