const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    masterId: String,
    subcategoryId: String,
    subtosubcategoryId: String,
    categorytype: String,
    categoryvalue: String,
    action: String,
    image: Buffer,
    imageType: String
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
