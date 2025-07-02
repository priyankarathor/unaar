const mongoose = require('mongoose');

const Advertise = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    buttontitle:{
        type:String
    },
    link:{
        type:String
    }
})

const advertise = mongoose.model('Advertise',Advertise);
module.exports = advertise;