const mongoose = require('mongoose');

const herosection = new mongoose.Schema({
    title :{
        type: String
    },
    subtitle:{
        type: String
    },
    status:{
        type : String
    },
    popularenquirylist:{
        type: String
    },
    enquirylink:{
        type : String
    }
})

const homesectiondata = mongoose.model('homesection',herosection);
module.exports = homesectiondata;