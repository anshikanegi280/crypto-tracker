const coinGeckoService = require('../services/coinGeckoService');

exports.getAllCoins = async (req, res) => {
    try {
        const { 
            page = 1, 
            per_page = 50, 
            vs_currency = 'usd',
            order = 'market_cap_desc'
        } = req.query;
        
        const options = {
            page: parseInt(page),
            per_page: parseInt(per_page),
            vs_currency,
            order,
            sparkline: false,
            price_change_percentage: '24h'
        };
        
        console.log('getAllCoins options:', options);
        
        const data = await coinGeckoService.getMarketData([], options);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error in getAllCoins:', error.message);
        res.status(500).json({ message: 'Error fetching coins data', error: error.message });
    }
};

exports.getCoinById = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await coinGeckoService.getCryptocurrencyData(id);
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error in getCoinById for ${id}:`, error.message);
        res.status(500).json({ message: 'Error fetching coin details', error: error.message });
    }
};

exports.getCoinMarketData = async (req, res) => {
    const { id } = req.params;
    const { vs_currency = 'usd' } = req.query;
    
    try {
        const options = {
            vs_currency,
            per_page: 1,
            sparkline: false,
            price_change_percentage: '24h'
        };
        
        const data = await coinGeckoService.getMarketData([id], options);
        res.status(200).json(data[0] || null);
    } catch (error) {
        console.error(`Error in getCoinMarketData for ${id}:`, error.message);
        res.status(500).json({ message: 'Error fetching coin market data', error: error.message });
    }
};

// Legacy method names for backward compatibility
exports.getCoins = exports.getAllCoins;
exports.getCoinDetail = exports.getCoinById;