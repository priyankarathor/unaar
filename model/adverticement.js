const mongoose = require("mongoose");

const advertisementSchematab = new mongoose.Schema({
    image: Buffer,
    imageType: String,
    description: String,
    status: String
}, { timestamps: true });

module.exports = mongoose.model("Advertisement", advertisementSchematab);
