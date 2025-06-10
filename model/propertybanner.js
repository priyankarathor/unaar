const mongoose = require("mongoose");

const propertybannerSchematab = new mongoose.Schema({
    tag:String,
    buttontag: String,
    categoryProperty:String,
    loaction: String,
    latitute: String,
    longitute: String,
    country: String,
    city :String,
    state:String,
    loactionlabal: String
}, { timestamps: true });

module.exports = mongoose.model("propertybannerSchema", propertybannerSchematab);
