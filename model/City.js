// models/Sub Category.js
const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    masterId :{
        type:String
    },
    subcategoryId:{
        type:String
    },
    subtosubcategoryid:{
        type:String
    },
    categorytype: { type: String, required: true },//city
    categoryvalue: { type: String, required: true },
    image: { type: Buffer },
    imageType: {
        type : String 
    },
    action: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('citySchema', citySchema);
