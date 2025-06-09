const mongoose = require('mongoose');

const Adverticement = new mongoose.Schema({
    image: {
        type: Buffer,
        required: true 
    },
    imageType: {
        type : String 
    },
    description: {
        type: String,
        required: true 
    },
    status:{
        type:String
    }
});

const Adverticements = mongoose.model('Adverticement', Adverticement);

module.exports = Adverticements;
