<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
    <Header />
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <!-- Portfolio Header -->
      <div class="mb-8 lg:mb-12">
        <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 lg:p-8">
          <h1 class="text-2xl lg:text-4xl font-bold text-white mb-4">Portfolio</h1>
          <div class="flex flex-col lg:flex-row lg:items-end gap-4">
            <span class="text-3xl lg:text-5xl font-bold text-white">${{ formatNumber(portfolio.totalValue) }}</span>
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
                 :class="portfolio.totalProfitLoss >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'">
              <span>${{ formatNumber(Math.abs(portfolio.totalProfitLoss)) }}</span>
              <span>{{ portfolio.totalProfitLossPercentage?.toFixed(2) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
        <!-- Portfolio Card -->
        <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
          <div class="flex justify-between items-center mb-6">
            <span class="text-gray-400 text-sm font-medium">Portfolio</span>
            <span class="text-white text-xl font-bold">${{ formatNumber(portfolio.totalValue) }}</span>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Total Assets</span>
              <span class="text-white font-semibold">${{ formatNumber(portfolio.totalValue) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Free Liabilities</span>
              <span class="text-white font-semibold">$0</span>
            </div>
          </div>
        </div>

        <!-- Allocation Card -->
        <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
          <div class="text-gray-400 text-sm font-medium mb-6">Protocol Allocation</div>
          <div class="flex flex-col lg:flex-row items-center gap-6">
            <div class="relative">
              <div class="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-conic from-blue-500 via-emerald-500 to-purple-500 p-1">
                <div class="w-full h-full bg-gray-800 rounded-full flex flex-col items-center justify-center">
                  <span class="text-white font-bold text-sm lg:text-base">${{ formatShortNumber(portfolio.totalValue) }}</span>
                  <span class="text-gray-400 text-xs">Total</span>
                </div>
              </div>
            </div>
            <div class="space-y-2 w-full lg:w-auto">
              <div v-for="(coin, index) in portfolioCoins.slice(0, 4)" :key="coin.coinId" 
                   class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: getChartColor(index) }"></div>
                <span class="text-gray-300 text-sm flex-1">{{ coin.symbol?.toUpperCase() }}</span>
                <span class="text-white font-semibold text-sm">{{ getPortfolioPercentage(coin.currentValue) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Card -->
        <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
          <div class="text-gray-400 text-sm font-medium mb-6">Performance</div>
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <span class="text-emerald-400">📈</span>
              </div>
              <div class="flex-1">
                <div class="text-gray-300 text-sm">Wallet</div>
                <div class="text-emerald-400 font-semibold">+$19,340.24</div>
                <div class="text-gray-500 text-xs">+52.34%</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <span class="text-purple-400">💎</span>
              </div>
              <div class="flex-1">
                <div class="text-gray-300 text-sm">DeFi</div>
                <div class="text-emerald-400 font-semibold">+$1,240.24</div>
                <div class="text-gray-500 text-xs">+13.34%</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <span class="text-red-400">📊</span>
              </div>
              <div class="flex-1">
                <div class="text-gray-300 text-sm">Savings</div>
                <div class="text-red-400 font-semibold">-$19</div>
                <div class="text-gray-500 text-xs">-0.01%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Portfolio Breakdown -->
      <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 lg:p-8">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
          <h2 class="text-xl lg:text-2xl font-bold text-white">Protocol Breakdown</h2>
          <div class="flex gap-2">
            <button class="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors">All</button>
            <button class="px-4 py-2 text-gray-400 border border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-700/50 transition-colors">Chain</button>
            <button class="px-4 py-2 text-gray-400 border border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-700/50 transition-colors">Protocol</button>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <div class="grid grid-cols-6 gap-4 pb-4 border-b border-gray-700/50 text-gray-400 text-sm font-medium uppercase tracking-wider">
            <div>Name</div>
            <div>Token</div>
            <div>Protocol</div>
            <div>Chain</div>
            <div>Address</div>
            <div>Value</div>
          </div>

          <div class="divide-y divide-gray-700/30">
            <div v-if="portfolioCoins.length === 0" class="text-center py-16">
              <div class="text-6xl mb-4">💼</div>
              <h3 class="text-white text-xl font-semibold mb-2">Your portfolio is empty</h3>
              <p class="text-gray-400 mb-6">Add some cryptocurrencies to get started</p>
              <router-link to="/" class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Browse Cryptocurrencies
              </router-link>
            </div>

            <div v-for="coin in portfolioCoins" :key="coin.coinId" class="grid grid-cols-6 gap-4 py-4 items-center">
              <div class="flex items-center gap-3">
                <img v-if="coin.image" :src="coin.image" :alt="coin.name" class="w-8 h-8 rounded-full" />
                <div>
                  <div class="text-white font-semibold">{{ coin.name }}</div>
                  <div class="text-gray-400 text-sm">{{ coin.amount }} {{ coin.symbol?.toUpperCase() }}</div>
                </div>
              </div>
              <div class="text-gray-300">{{ coin.symbol?.toUpperCase() }}</div>
              <div class="text-gray-300">{{ coin.name }}</div>
              <div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                  Ethereum
                </span>
              </div>
              <div class="font-mono text-gray-400 text-sm">0x1f9840...3E4A</div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-white font-semibold">${{ formatNumber(coin.currentValue) }}</div>
                  <div class="flex items-center gap-1 text-sm"
                       :class="coin.profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'">
                    <span>${{ formatNumber(Math.abs(coin.profitLoss)) }}</span>
                    <span>{{ coin.profitLossPercentage?.toFixed(2) }}%</span>
                  </div>
                </div>
                <button @click="removeCoin(coin.coinId)" 
                        class="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full flex items-center justify-center transition-colors">
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden space-y-4">
          <div v-if="portfolioCoins.length === 0" class="text-center py-16">
            <div class="text-6xl mb-4">💼</div>
            <h3 class="text-white text-xl font-semibold mb-2">Your portfolio is empty</h3>
            <p class="text-gray-400 mb-6">Add some cryptocurrencies to get started</p>
            <router-link to="/" class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Browse Cryptocurrencies
            </router-link>
          </div>

          <div v-for="coin in portfolioCoins" :key="coin.coinId" 
               class="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <img v-if="coin.image" :src="coin.image" :alt="coin.name" class="w-10 h-10 rounded-full" />
                <div>
                  <div class="text-white font-semibold">{{ coin.name }}</div>
                  <div class="text-gray-400 text-sm">{{ coin.amount }} {{ coin.symbol?.toUpperCase() }}</div>
                </div>
              </div>
              <button @click="removeCoin(coin.coinId)" 
                      class="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full flex items-center justify-center transition-colors">
                ×
              </button>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div class="text-gray-400">Value</div>
                <div class="text-white font-semibold">${{ formatNumber(coin.currentValue) }}</div>
              </div>
              <div>
                <div class="text-gray-400">P&L</div>
                <div :class="coin.profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'">
                  ${{ formatNumber(Math.abs(coin.profitLoss)) }} ({{ coin.profitLossPercentage?.toFixed(2) }}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import { computed, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Portfolio',
  components: {
    Header,
  },
  setup() {
    const store = useStore();

    const portfolio = computed(() => store.getters.portfolio);
    const portfolioCoins = computed(() => store.getters.portfolioCoins);
    const isLoading = computed(() => store.getters.isLoading);
    const error = computed(() => store.getters.error);

    const formatNumber = (value) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value || 0);
    };

    const formatShortNumber = (value) => {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return formatNumber(value);
    };

    const getChartColor = (index) => {
      const colors = ['#00d4ff', '#00ff88', '#ff6b6b', '#ffd93d', '#6c5ce7'];
      return colors[index % colors.length];
    };

    const getPortfolioPercentage = (value) => {
      if (portfolio.value.totalValue === 0) return 0;
      return ((value / portfolio.value.totalValue) * 100).toFixed(1);
    };

    const removeCoin = async (coinId) => {
      if (confirm('Are you sure you want to remove this coin from your portfolio?')) {
        try {
          await store.dispatch('removeCoinFromPortfolio', coinId);
        } catch (error) {
          alert('Failed to remove coin: ' + error.message);
        }
      }
    };

    onMounted(() => {
      store.dispatch('fetchPortfolio');
    });

    return {
      portfolio,
      portfolioCoins,
      isLoading,
      error,
      formatNumber,
      formatShortNumber,
      getChartColor,
      getPortfolioPercentage,
      removeCoin,
    };
  },
};
</script>

<style>
.bg-gradient-conic {
  background: conic-gradient(from 0deg, #3b82f6, #10b981, #8b5cf6, #3b82f6);
}
</style>