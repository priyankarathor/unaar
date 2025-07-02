const mongoose = require('mongoose');

const Agencies = new mongoose.Schema({
    image: {
        type: Buffer,
        required: true 
    },
    imageType: {
        type : String 
    },
    link: {
        type: String,
        required: true 
    },
    agenciename: {
        type: String,
    },
    status:{
        type:String
    }
});

const agencies = mongoose.model('agencies', Agencies);

module.exports = agencies;
