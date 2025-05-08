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
    propertylabel:{
        type:String
    },
    propertyvalue:{
        type:String
    },
    descriptiontitle:{
        type:String
    },
    descriptionlabel:{
        type:String
    },
    descriptionvalue:{
        type:String
    },
    description:{
        type:String,
        require : true
    },
    facilitietitle:{
        type:String,
    },
    facilitieimage:{ //image
        type:Buffer
    },
    facilitieimagetype:{ //image
        type:String
    },
    facilitievalue:{
        type:String,
    },
    facilitiedescription:{
        type:String,
    },
    featuretitle:{
        type:String
    },
    featureimage:{
        type:Buffer  //image
    },
    featureimagetype:{
        type:String  //image
    },
    locationtitle:{
        type:String
    },
    locationsubtitle:{
        type:String
    },
    locationlable:{
        type:String
    },
    locationvalue:{
        type:String
    },
    locationvaluetitle:{
        type:String
    },
    image:{
       type:Buffer //image
    },
    imageType: {
        type : String 
    },
    data:{
        type: Date,
        default: Date.now
    },
    apartmenttitle:{
        type : String 
    },
    apartmentlable:{
        type : String 
    },
    apartmendescription:{
        type : String 
    },
    remotelocationtitle:{
        type:String
    },
    remotelocationimage:{
        type:Buffer        //image
    },
    remotelocationimagetype:{
        type:String
    },
    remotelocationsubtitle:{
        type:String
    },
    tagtitle:{
        type:String
    }
})

const propertylistingdata = mongoose.model('propertylisting',propertylisting);
module.exports = propertylistingdata;