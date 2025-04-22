const mongoose = require('mongoose');

const Agencies = new mongoose.Schema({
    image:{
        type:String,
        require:true
    },
    link:{
        type:String,
        require:true
    },
    agenciename:{
        type:String
    }
})

const agencies = mongoose.model('agencies',Agencies);
module.exports = agencies;