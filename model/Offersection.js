const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    image: Buffer, // Store binary data
    imageType: String, // Store MIME type
    startdate: String,
    enddate: String,
    title: String,
    subtitle: String,
    buttonfirst: String,
    buttonseconed: String,
    link: String
}, { timestamps: true });

module.exports = mongoose.model('Offersection', offerSchema);
