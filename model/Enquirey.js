const mongoose = require('mongoose');

const Enquirey = new mongoose.Schema({
    inquire:{
        type:String,
        require : true
    },
    fullname:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require : true
    },
    phoneNo:{
        type:String
    }
})

const inquire = mongoose.model('inquire',Enquirey);
module.exports = inquire;