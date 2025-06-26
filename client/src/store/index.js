import { createStore } from 'vuex';
import { 
    fetchCryptocurrencies, 
    fetchPortfolio, 
    addCoinToPortfolio, 
    removeCoinFromPortfolio,
    fetchTrendingCoins,
    fetchMarketData
} from '../services/api';

export default createStore({
    state: {
        cryptocurrencies: [],
        trendingCoins: [],
        portfolio: {
            coins: [],
            totalValue: 0,
            totalPurchaseValue: 0,
            totalProfitLoss: 0,
            totalProfitLossPercentage: 0
        },
        loading: false,
        error: null,
    },
    mutations: {
        SET_CRYPTOCURRENCIES(state, cryptocurrencies) {
            state.cryptocurrencies = cryptocurrencies;
        },
        SET_TRENDING_COINS(state, trendingCoins) {
            state.trendingCoins = trendingCoins;
        },
        SET_PORTFOLIO(state, portfolio) {
            state.portfolio = portfolio;
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
    },
    actions: {
        async fetchCryptocurrencies({ commit }) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);
            try {
                const data = await fetchCryptocurrencies();
                commit('SET_CRYPTOCURRENCIES', data);
            } catch (error) {
                commit('SET_ERROR', error.message || 'Failed to fetch cryptocurrencies');
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async fetchTrendingCoins({ commit }) {
            try {
                const data = await fetchTrendingCoins();
                commit('SET_TRENDING_COINS', data.coins || []);
            } catch (error) {
                commit('SET_ERROR', error.message || 'Failed to fetch trending coins');
            }
        },
        async fetchPortfolio({ commit }) {
            try {
                const data = await fetchPortfolio();
                commit('SET_PORTFOLIO', data);
            } catch (error) {
                commit('SET_ERROR', error.message || 'Failed to fetch portfolio');
            }
        },
        async addCoinToPortfolio({ commit, dispatch }, { coinId, amount }) {
            try {
                await addCoinToPortfolio(coinId, amount);
                // Refresh portfolio after adding
                await dispatch('fetchPortfolio');
            } catch (error) {
                commit('SET_ERROR', error.message || 'Failed to add coin to portfolio');
                throw error;
            }
        },
        async removeCoinFromPortfolio({ commit, dispatch }, coinId) {
            try {
                await removeCoinFromPortfolio(coinId);
                // Refresh portfolio after removing
                await dispatch('fetchPortfolio');
            } catch (error) {
                commit('SET_ERROR', error.message || 'Failed to remove coin from portfolio');
                throw error;
            }
        },
    },
    getters: {
        allCryptocurrencies: (state) => state.cryptocurrencies,
        trendingCoins: (state) => state.trendingCoins,
        portfolio: (state) => state.portfolio,
        portfolioCoins: (state) => state.portfolio.coins || [],
        isLoading: (state) => state.loading,
        error: (state) => state.error,
    },
});