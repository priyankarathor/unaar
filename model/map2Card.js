const mongoose = require('mongoose');

const map2CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  value1:{
    type : String
  },
  label1:{
    type : String
  },
  value2:{
    type : String
  },
  label2:{
    type : String
  },
 value3:{
    type : String
  },
  label3:{
    type : String
  },
  value4:{
    type : String
  },
  label4:{
    type : String
  },
  buttontitle:{
    type: String
  },
  link:{
    type: String
  }
});

// Model name: 'homelayout' will be the MongoDB collection name (lowercased + pluralized)
const map2layout = mongoose.model('map2layout', map2CardSchema);

module.exports = map2layout;