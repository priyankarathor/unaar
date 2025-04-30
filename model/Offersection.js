const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    image: Buffer,         // Storing image as a Buffer (binary data)
    imageType: String,     // MIME type of the image
    startdate: String,
    enddate: String,
    title: String,
    subtitle: String,
    buttonfirst: String,
    buttonseconed: String,
    link: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Offersection', offerSchema);
