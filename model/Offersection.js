const mongoose = require('mongoose');

const Offersection =  new mongoose.Schema({
    Image:{
        type : String,
        require : true
    },
    startdate:{
        type:String
    },
    enddate:{
        type:String
    },
    title:{
        type:String,
        require:true
    },
    subtitle:{
        type:String,
        require:true
    },
    buttonfirst:{
        type:String,
        require:true
    },
    link:{
        type:String
    },
    buttonseconed:{
        type:String,
        require:true
    }
})

const offersection = mongoose.model('Offersection',Offersection);
module.exports = offersection;