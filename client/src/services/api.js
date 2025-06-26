import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(request => {
    console.log('Frontend API Request:', request.url);
    return request;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('Frontend API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const fetchCryptocurrencies = async (page = 1, perPage = 50) => {
    try {
        const response = await apiClient.get('/api/coins', {
            params: {
                page,
                per_page: perPage,
                vs_currency: 'usd',
                order: 'market_cap_desc'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
        throw error;
    }
};

export const fetchMarketData = async (ids = [], options = {}) => {
    try {
        const params = {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 50,
            page: 1,
            ...options
        };
        
        if (ids.length > 0) {
            params.ids = ids.join(',');
        }
        
        const response = await apiClient.get('/api/coins/markets', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
    }
};

export const fetchTrendingCoins = async () => {
    try {
        const response = await apiClient.get('/api/coins/trending');
        return response.data;
    } catch (error) {
        console.error('Error fetching trending coins:', error);
        throw error;
    }
};

export const fetchCoinDetail = async (id) => {
    try {
        const response = await apiClient.get(`/api/coins/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for coin ${id}:`, error);
        throw error;
    }
};

export const fetchCoinDetails = async (id) => {
    return fetchCoinDetail(id);
};

export const fetchHistoricalData = async (id, days = 7) => {
    try {
        const response = await apiClient.get(`/api/coins/${id}/history`, {
            params: { days }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching historical data for coin ${id}:`, error);
        throw error;
    }
};

export const searchCoins = async (query) => {
    try {
        const response = await apiClient.get(`/api/coins/search/${query}`);
        return response.data;
    } catch (error) {
        console.error(`Error searching for coins with query ${query}:`, error);
        throw error;
    }
};

// Portfolio API functions
export const fetchPortfolio = async () => {
    try {
        const response = await apiClient.get('/api/portfolio');
        return response.data;
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        throw error;
    }
};

export const addCoinToPortfolio = async (coinId, amount) => {
    try {
        const response = await apiClient.post('/api/portfolio/add', {
            coinId,
            amount: parseFloat(amount)
        });
        return response.data;
    } catch (error) {
        console.error('Error adding coin to portfolio:', error);
        throw error;
    }
};

export const removeCoinFromPortfolio = async (coinId) => {
    try {
        const response = await apiClient.delete(`/api/portfolio/remove/${coinId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing coin from portfolio:', error);
        throw error;
    }
};

const api = {
    getCryptocurrencies: fetchCryptocurrencies,
    getMarketData: fetchMarketData,
    getTrendingCoins: fetchTrendingCoins,
    getCoinDetail: fetchCoinDetail,
    getCoinDetails: fetchCoinDetails,
    getHistoricalData: fetchHistoricalData,
    searchCoins: searchCoins,
    getPortfolio: fetchPortfolio,
    addCoinToPortfolio: addCoinToPortfolio,
    removeCoinFromPortfolio: removeCoinFromPortfolio
};

export default api;