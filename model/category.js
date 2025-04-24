const mongoose = require("mongoose");

const category = new mongoose.Schema(
    {
        categorytype:{
            type:String,
            require : true
        },
        categoryvalue:{
            type:String,
            require : true
        },
        image:{
            type:String
        },
        action:{
            type:String
        }
    }
) 

const categoryvalue = mongoose.model('category',category);
module.exports = categoryvalue;