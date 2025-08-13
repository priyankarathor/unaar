const mongoose = require('mongoose');

const AgenciesSchema = new mongoose.Schema({
    image: {
        type: String, // store S3 URL instead of Buffer
        required: true
    },
    link: {
        type: String,
        required: true
    },
    agenciename: {
        type: String
    },
    status: {
        type: String
    }
}, { timestamps: true });

const Agencies = mongoose.model('Agencies', AgenciesSchema);

module.exports = Agencies;
