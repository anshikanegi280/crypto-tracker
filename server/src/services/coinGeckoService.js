const axios = require('axios');

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY;

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: COINGECKO_API_URL,
    headers: API_KEY ? { 'X-CG-Demo-API-Key': API_KEY } : {}, // Fixed header name
    timeout: 15000 // Increased timeout
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(request => {
    console.log('Making request to:', request.url);
    return request;
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.error || error.message
        });
        return Promise.reject(error);
    }
);

const getCryptocurrencyData = async (id) => {
    try {
        const response = await apiClient.get(`/coins/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cryptocurrency data for ${id}:`, error.message);
        throw new Error('Error fetching cryptocurrency data');
    }
};

const getMarketData = async (ids = [], options = {}) => {
    try {
        const params = {
            vs_currency: options.vs_currency || 'usd', // Always ensure vs_currency is set
            order: options.order || 'market_cap_desc',
            per_page: options.per_page || 50,
            page: options.page || 1,
            sparkline: options.sparkline || false,
            price_change_percentage: options.price_change_percentage || '24h'
        };
        
        // Only add ids parameter if we have specific coin IDs
        if (ids && ids.length > 0) {
            params.ids = Array.isArray(ids) ? ids.join(',') : ids;
        }
        
        console.log('Market data request params:', params);
        
        const response = await apiClient.get('/coins/markets', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching market data:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            params: error.config?.params
        });
        throw new Error(`Failed to fetch market data: ${error.response?.data?.error || error.message}`);
    }
};

const getTrendingCryptocurrencies = async () => {
    try {
        console.log('Fetching trending cryptocurrencies...');
        const response = await apiClient.get('/search/trending');
        
        // CoinGecko returns trending data in a specific format
        if (response.data && response.data.coins) {
            // Extract and format trending coins
            const trendingCoins = response.data.coins.map(item => ({
                id: item.item.id,
                name: item.item.name,
                symbol: item.item.symbol,
                market_cap_rank: item.item.market_cap_rank,
                thumb: item.item.thumb,
                small: item.item.small,
                large: item.item.large,
                slug: item.item.slug,
                price_btc: item.item.price_btc,
                score: item.item.score
            }));
            
            return {
                coins: trendingCoins,
                nfts: response.data.nfts || [],
                categories: response.data.categories || []
            };
        }
        
        return response.data;
    } catch (error) {
        console.error('Error fetching trending cryptocurrencies:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        
        // Re-throw the error instead of returning mock data
        throw new Error(`Failed to fetch trending data: ${error.response?.data?.error || error.message}`);
    }
};

const getCoinHistory = async (id, days = 7) => {
    try {
        const response = await apiClient.get(`/coins/${id}/market_chart`, {
            params: {
                vs_currency: 'usd',
                days: days
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching historical data for ${id}:`, error.message);
        throw new Error('Error fetching historical data');
    }
};

const searchCoins = async (query) => {
    try {
        const response = await apiClient.get('/search', {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error(`Error searching for coins with query ${query}:`, error.message);
        throw new Error('Error searching coins');
    }
};

module.exports = {
    getCryptocurrencyData,
    getMarketData,
    getTrendingCryptocurrencies,
    getCoinHistory,
    searchCoins
};