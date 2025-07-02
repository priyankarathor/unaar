const cron = require('node-cron');
const { fetchAndSaveExchangeRates } = require('../controllers/exchangeController');

// Run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('⏰ Midnight Cron Job Triggered: Fetching exchange rates...');
  await fetchAndSaveExchangeRates();
});
