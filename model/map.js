const mongoose = require("mongoose");

const map1Schematab = new mongoose.Schema({
    image: Buffer,
    imageType: String,
    status: String
}, { timestamps: true });

module.exports = mongoose.model("Map1", map1Schematab);
