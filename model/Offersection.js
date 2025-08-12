// models/Offersection.js
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  image: { type: String },      // stores S3 URL
  startdate: { type: String },
  enddate: { type: String },
  title: { type: String },
  subtitle: { type: String },
  buttonfirst: { type: String },
  buttonseconed: { type: String },
  link: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Offersection', offerSchema);
