const axios = require('axios');
const ExchangeRate = require('../model/exchangeRate');

// Function to fetch from external API and save if not already saved for today
const fetchAndSaveExchangeRates = async () => {
  try {
    const response = await axios.get('https://api.exchangeratesapi.io/v1/latest', {
      params: {
        access_key: 'ea88bce90b1a89d8275754c49a9247f1',
        symbols: 'USD,INR,GBP,JPY,AUD,CAD,CHF,CNY,SGD,NZD'
      }
    });

    const { base, date, rates } = response.data;

    // Check if already saved for this date
    const exists = await ExchangeRate.findOne({ date });
    if (exists) {
      console.log(`Exchange rate for ${date} already exists. Skipping insert.`);
      return;
    }

    const newRate = new ExchangeRate({
      base,
      date,
      USD: rates.USD,
      INR: rates.INR,
      GBP: rates.GBP,
      JPY: rates.JPY,
      AUD: rates.AUD,
      CAD: rates.CAD,
      CHF: rates.CHF,
      CNY: rates.CNY,
      SGD: rates.SGD,
      NZD: rates.NZD
    });

    await newRate.save();
    console.log(`✔ Exchange rates saved for: ${date}`);
  } catch (error) {
    console.error('❌ Error fetching exchange rates:', error.message);
  }
};

// Get the latest exchange rate
const getLatestExchangeRate = async (req, res) => {
  try {
    const latest = await ExchangeRate.findOne().sort({ createdAt: -1 });
    if (!latest) {
      return res.status(404).json({ success: false, message: 'No exchange rates found' });
    }
    res.status(200).json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { fetchAndSaveExchangeRates, getLatestExchangeRate };
