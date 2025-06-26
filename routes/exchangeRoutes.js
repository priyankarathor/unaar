const express = require('express');
const router = express.Router();
const { fetchAndSaveExchangeRates, getLatestExchangeRate } = require('../controllers/exchangeController');

// Manually trigger data fetch
router.post('/fetch-exchange-rates', async (req, res) => {
  try {
    await fetchAndSaveExchangeRates();
    res.status(200).json({ success: true, message: 'Exchange rates fetched and saved (if not already)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch exchange rates' });
  }
});

// Get the latest exchange rate from DB
router.get('/latest-exchange-rates', getLatestExchangeRate);

module.exports = router;
