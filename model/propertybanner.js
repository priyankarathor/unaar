const mongoose = require("mongoose");

const propertybannerSchematab = new mongoose.Schema({
    image: Buffer,
    imageType: String,
    description: String,
    buttontag:String,
    status: String
}, { timestamps: true });

module.exports = mongoose.model("propertybannerSchema", propertybannerSchematab);
