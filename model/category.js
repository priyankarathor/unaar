// models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    categorytype: { type: String, required: true },
    categoryvalue: { type: String, required: true },
    image: { type: Buffer },
    imageType: {
        type : String 
    },
    action: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
