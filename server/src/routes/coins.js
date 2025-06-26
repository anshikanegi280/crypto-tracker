const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');
const coinGeckoService = require('../services/coinGeckoService');

// Route to get all cryptocurrencies
router.get('/', coinController.getAllCoins);

// Route to get market data (MUST be before /:id route)
router.get('/markets', async (req, res) => {
    try {
        const { 
            vs_currency = 'usd', 
            order = 'market_cap_desc', 
            per_page = 50, 
            page = 1,
            ids
        } = req.query;
        
        const options = {
            vs_currency,
            order,
            per_page: parseInt(per_page),
            page: parseInt(page),
            sparkline: false,
            price_change_percentage: '24h'
        };
        
        const coinIds = ids ? ids.split(',') : [];
        const marketData = await coinGeckoService.getMarketData(coinIds, options);
        
        res.status(200).json(marketData);
    } catch (error) {
        console.error('Error in markets route:', error.message);
        res.status(500).json({ 
            message: 'Error fetching market data', 
            error: error.message 
        });
    }
});

// Route to get trending cryptocurrencies (MUST be before /:id route)
router.get('/trending', async (req, res) => {
    try {
        console.log('Trending route called');
        const trendingData = await coinGeckoService.getTrendingCryptocurrencies();
        
        console.log('Trending data fetched successfully:', trendingData.coins?.length || 0, 'coins');
        
        res.status(200).json(trendingData);
    } catch (error) {
        console.error('Error in trending route:', error.message);
        res.status(500).json({ 
            message: 'Error fetching trending cryptocurrencies', 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Route to search coins (MUST be before /:id route)
router.get('/search/:query', async (req, res) => {
    const { query } = req.params;
    
    try {
        const searchResults = await coinGeckoService.searchCoins(query);
        res.status(200).json(searchResults);
    } catch (error) {
        console.error(`Error searching for ${query}:`, error.message);
        res.status(500).json({ message: 'Error searching coins', error: error.message });
    }
});

// Route to get a specific cryptocurrency by ID
router.get('/:id', coinController.getCoinById);

// Route to get market data for a specific cryptocurrency
router.get('/:id/market_data', coinController.getCoinMarketData);

// Route to get historical data for a specific cryptocurrency
router.get('/:id/history', async (req, res) => {
    const { id } = req.params;
    const { days = 7 } = req.query;
    
    try {
        const historicalData = await coinGeckoService.getCoinHistory(id, days);
        
        // Format the data for easier consumption
        const formattedData = historicalData.prices.map((price, index) => ({
            date: new Date(price[0]).toISOString().split('T')[0],
            price: price[1],
            market_cap: historicalData.market_caps[index] ? historicalData.market_caps[index][1] : null,
            volume: historicalData.total_volumes[index] ? historicalData.total_volumes[index][1] : null
        }));
        
        res.status(200).json(formattedData);
    } catch (error) {
        console.error(`Error fetching historical data for ${id}:`, error.message);
        res.status(500).json({ message: 'Error fetching historical data', error: error.message });
    }
});

module.exports = router;