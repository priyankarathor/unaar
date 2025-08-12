const mongoose = require('mongoose');

const GoldenvisaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    description: {
        type: String
    },
    image: { // Will store AWS S3 image URL here
        type: String
    },
    buttontitle: {
        type: String,
        required: true
    },
    link: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Goldenvisa', GoldenvisaSchema);
