const mongoose = require('mongoose');

const homeLayoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'], // optional validation
    default: 'active',
  }
});

// Model name: 'homelayout' will be the MongoDB collection name (lowercased + pluralized)
const HomeLayout = mongoose.model('homelayout', homeLayoutSchema);

module.exports = HomeLayout;
