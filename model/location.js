const mongoose = require('mongoose');

const Location = new mongoose.Schema({
    Country: {
        type: String
    },
    State: {
        type : String 
    },
    City: {
        type: String
    },
    PropertyId: {
        type: String,
    }
});

const Locations = mongoose.model('Location', Location);

module.exports = Locations;
