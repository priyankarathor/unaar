const mongoose = require('mongoose');

const userdata = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type:String
    },
    role:{
        type:String,
        required : true
    },
    accessrole:{
        type:String
    }
})

const user = mongoose.model('user',userdata);

module.exports = user;