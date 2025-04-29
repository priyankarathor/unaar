const mongoose = require('mongoose');

const Investment = new mongoose.Schema({
    title:{
        type:String,
        require : true
    },
    subtitle:{
        type:String,
        require: true
    },
    description:{
        type:String,
        require : true
    },
    buttontitle:{
        type:String
    },
    Image:{
        type: Date,
        default: Date.now
    }
})

const investment = mongoose.model('Investment',Investment);
module.exports = investment;