const mongoose = require('mongoose');

const Developer = new mongoose.Schema({
    farmname:{
        String
    },
    title:{
        String
    },
    About:{
        String
    },
    year:{
        String
    },
    otherdetails:{
        String
    },
    History:{
        String
    },
    image:{
        Buffer
    },
    imagetype:{
        String
    }
})

const Developers = mongoose.model('Developer',Developer);
module.exports = Developers;