const mongoose = require('mongoose');

const blogs = new mongoose.Schema({
    title :{
        type:String
    },
    subtitle:{
        type:String
    },
    description:{
        type:String
    },
    image: {
         type: Buffer 
        },
    imageType: {
        type : String 
    },
    action:{
        type:String
    },
    date:{
        type: Date,
        default: Date.now
    },
    categorytitle:{
        type:String
    },  
    categorylable:{
        type:String
    },
    categoryValue:{
        type:String
    },
    categoryType:{
        type:String
    },
    authername:{
        type:String
    },
    metatitle:{
        type :String
    },
    metadescription:{
        type:String
    },
    metakeyword:{
        type:String
    }
})


const blog = mongoose.model('blogs',blogs);
module.exports = blog;