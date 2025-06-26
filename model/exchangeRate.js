const mongoose = require('mongoose');

const ExchangeRateSchema = new mongoose.Schema({
  base: String,
  date: String,
  USD: Number,
  INR: Number,
  GBP: Number,
  JPY: Number,
  AUD: Number,
  CAD: Number,
  CHF: Number,
  CNY: Number,
  SGD: Number,
  NZD: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExchangeRate', ExchangeRateSchema);
