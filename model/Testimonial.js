const mongoose = require('mongoose');

const Testimonial = new mongoose.Schema({
    image:{
        type:Buffer
    },
    imageType: {
        type : String 
    },
    Name:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require : true
    },
    designation:{
        type:String
    },
    message:{
        type:String
    },
    star:{
        type:String
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const testimonial = mongoose.model('Testimonial',Testimonial);
module.exports = testimonial;


