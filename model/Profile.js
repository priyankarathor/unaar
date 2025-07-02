const mongoose = require('mongoose');

const profilesection = new mongoose.Schema({
    firstname :{
        type: String
    },
    lastname:{
        type: String
    },
    email:{
        type:String
    },
    location:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type : String
    },
    country:{
        type: String
    },
    contactdetails:{
        type : String
    },
    phone:{
        type : String
    },
    password:{
        type : String
    },
    propertyId:{
        type: String
    },
    userrole:{
        type: String
    }
})

const profilesectiondata = mongoose.model('profilesection',profilesection);
module.exports = profilesectiondata;