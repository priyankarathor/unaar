const mongoose = require('mongoose');

const Goldenvisa =  new mongoose.Schema({
    title:{
        type : String,
        require : true
    },
    subtitle:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    buttontitle:{
        type:String,
        require:true
    }
})

const goldenvisa = mongoose.model('goldenvisa',Goldenvisa);
module.exports = goldenvisa;