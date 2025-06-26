const Portfolio = require('../models/Portfolio');
const coinGeckoService = require('../services/coinGeckoService');

// In-memory storage as fallback
let portfolios = [];

// Get user's portfolio
exports.getPortfolio = async (req, res) => {
    try {
        let portfolio;
        
        try {
            // Fetch portfolio from database
            portfolio = await Portfolio.findOne({ userId: 'default-user' });
            
            if (!portfolio || !portfolio.coins || portfolio.coins.length === 0) {
                return res.status(200).json({ coins: [], totalValue: 0 });
            }

            // Extract coin IDs from portfolio
            const coinIds = portfolio.coins.map(coin => coin.coinId);
            
            // Fetch current market data from CoinGecko
            const marketData = await coinGeckoService.getMarketData(coinIds);
            
            // Combine portfolio data with current market data
            const enrichedPortfolio = portfolio.coins.map(portfolioCoin => {
                const currentMarketData = marketData.find(market => market.id === portfolioCoin.coinId);
                
                if (currentMarketData) {
                    const currentValue = portfolioCoin.amount * currentMarketData.current_price;
                    const purchaseValue = portfolioCoin.amount * portfolioCoin.purchasePrice;
                    const profitLoss = currentValue - purchaseValue;
                    const profitLossPercentage = purchaseValue > 0 ? ((profitLoss / purchaseValue) * 100) : 0;
                    
                    return {
                        ...portfolioCoin.toObject(),
                        name: currentMarketData.name,
                        symbol: currentMarketData.symbol,
                        image: currentMarketData.image,
                        current_price: currentMarketData.current_price,
                        price_change_24h: currentMarketData.price_change_24h,
                        price_change_percentage_24h: currentMarketData.price_change_percentage_24h,
                        market_cap: currentMarketData.market_cap,
                        currentValue: currentValue,
                        purchaseValue: purchaseValue,
                        profitLoss: profitLoss,
                        profitLossPercentage: profitLossPercentage
                    };
                }
                
                return {
                    ...portfolioCoin.toObject(),
                    currentValue: 0,
                    error: 'Market data not available'
                };
            });
            
            // Calculate total portfolio value
            const totalValue = enrichedPortfolio.reduce((sum, coin) => sum + (coin.currentValue || 0), 0);
            const totalPurchaseValue = enrichedPortfolio.reduce((sum, coin) => sum + (coin.purchaseValue || 0), 0);
            const totalProfitLoss = totalValue - totalPurchaseValue;
            const totalProfitLossPercentage = totalPurchaseValue > 0 ? ((totalProfitLoss / totalPurchaseValue) * 100) : 0;
            
            res.status(200).json({
                coins: enrichedPortfolio,
                totalValue: totalValue,
                totalPurchaseValue: totalPurchaseValue,
                totalProfitLoss: totalProfitLoss,
                totalProfitLossPercentage: totalProfitLossPercentage
            });
            
        } catch (dbError) {
            console.log('Database not available, using mock data');
            
            // Fallback: check in-memory storage and fetch market data
            if (portfolios.length > 0) {
                const coinIds = portfolios.map(coin => coin.coinId);
                const marketData = await coinGeckoService.getMarketData(coinIds);
                
                const enrichedPortfolio = portfolios.map(portfolioCoin => {
                    const currentMarketData = marketData.find(market => market.id === portfolioCoin.coinId);
                    
                    if (currentMarketData) {
                        const currentValue = portfolioCoin.amount * currentMarketData.current_price;
                        
                        return {
                            ...portfolioCoin,
                            name: currentMarketData.name,
                            symbol: currentMarketData.symbol,
                            image: currentMarketData.image,
                            current_price: currentMarketData.current_price,
                            currentValue: currentValue
                        };
                    }
                    
                    return portfolioCoin;
                });
                
                const totalValue = enrichedPortfolio.reduce((sum, coin) => sum + (coin.currentValue || 0), 0);
                
                return res.status(200).json({
                    coins: enrichedPortfolio,
                    totalValue: totalValue
                });
            }
            
            res.status(200).json({ coins: [], totalValue: 0 });
        }
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ message: 'Error fetching portfolio', error: error.message });
    }
};

// Add coin to portfolio
exports.addCoinToPortfolio = async (req, res) => {
    const { coinId, amount } = req.body;

    try {
        // Fetch current price from CoinGecko
        let currentPrice = 0;
        try {
            const marketData = await coinGeckoService.getMarketData([coinId], { per_page: 1 });
            currentPrice = marketData[0]?.current_price || 0;
        } catch (priceError) {
            console.warn(`Could not fetch current price for ${coinId}:`, priceError.message);
        }

        const newCoin = {
            coinId,
            amount: parseFloat(amount),
            purchasePrice: currentPrice,
            purchaseDate: new Date()
        };

        try {
            // Try to save to database
            const portfolio = await Portfolio.findOneAndUpdate(
                { userId: 'default-user' },
                { $addToSet: { coins: newCoin } },
                { new: true, upsert: true }
            );
            res.status(201).json(portfolio);
        } catch (dbError) {
            // Fallback to in-memory storage
            portfolios.push(newCoin);
            res.status(201).json({ message: 'Coin added to portfolio', coin: newCoin });
        }
    } catch (error) {
        console.error('Error adding coin to portfolio:', error);
        res.status(500).json({ message: 'Error adding coin to portfolio', error: error.message });
    }
};

// Remove coin from portfolio
exports.removeCoinFromPortfolio = async (req, res) => {
    const { coinId } = req.params;

    try {
        try {
            // Try to remove from database
            const portfolio = await Portfolio.findOneAndUpdate(
                { userId: 'default-user' },
                { $pull: { coins: { coinId } } },
                { new: true }
            );
            res.status(200).json(portfolio);
        } catch (dbError) {
            // Fallback to in-memory storage
            portfolios = portfolios.filter(coin => coin.coinId !== coinId);
            res.status(200).json({ message: 'Coin removed from portfolio' });
        }
    } catch (error) {
        console.error('Error removing coin from portfolio:', error);
        res.status(500).json({ message: 'Error removing coin from portfolio', error: error.message });
    }
};