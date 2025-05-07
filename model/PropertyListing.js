const mongoose = require('mongoose');

const propertylisting = new mongoose.Schema({
    category:{
        type:String
    },
    subcategory:{
        type:String
    },
    subtosubcategory:{
        type:String
    },
    title:{
        type:String,
        require : true
    },
    subtitle:{
        type:String,
        require: true
    },
    fromamout:{
        type:String
    },
    description:{
        type:String,
        require : true
    },
    buttontitle:{
        type:String
    },
    image:{
       type:Buffer
    },
    imageType: {
        type : String 
    },
    data:{
        type: Date,
        default: Date.now
    }
})

const propertylistingdata = mongoose.model('propertylisting',propertylisting);
module.exports = propertylistingdata;