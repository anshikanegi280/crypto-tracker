<template>
  <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300 hover:scale-105">
    <!-- Coin Header -->
    <div class="flex items-center gap-4 mb-6">
      <img v-if="coin.image" :src="coin.image" :alt="coin.name" class="w-12 h-12 rounded-full" />
      <div class="flex-1 min-w-0">
        <h3 class="text-white font-bold text-lg truncate">{{ coin.name }}</h3>
        <p class="text-gray-400 text-sm uppercase">{{ coin.symbol }}</p>
      </div>
    </div>

    <!-- Price Section -->
    <div class="mb-6">
      <div class="text-2xl font-bold text-white mb-2">{{ formatCurrency(coin.current_price) }}</div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-400">Market Cap</span>
        <span class="text-gray-300 font-semibold">{{ formatCurrencyShort(coin.market_cap) }}</span>
      </div>
      <div class="flex items-center justify-between text-sm mt-1">
        <span class="text-gray-400">24h Change</span>
        <div class="flex items-center gap-1"
             :class="coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="coin.price_change_percentage_24h >= 0" 
                  fill-rule="evenodd" 
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" 
                  clip-rule="evenodd" />
            <path v-else 
                  fill-rule="evenodd" 
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" 
                  clip-rule="evenodd" />
          </svg>
          <span class="font-semibold">{{ Math.abs(coin.price_change_percentage_24h)?.toFixed(2) }}%</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-3">
      <router-link :to="`/coin/${coin.id}`" 
                   class="block w-full bg-gray-700/50 hover:bg-gray-600/50 text-white text-center py-3 rounded-xl font-medium transition-colors">
        View Details
      </router-link>
      
      <div class="flex gap-3">
        <input 
          v-model="amount" 
          type="number" 
          placeholder="Amount" 
          min="0" 
          step="0.01"
          class="flex-1 px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button @click="addToPortfolio" 
                :disabled="!amount || amount <= 0"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-300 whitespace-nowrap">
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'CoinCard',
  props: {
    coin: {
      type: Object,
      required: true
    }
  },
  emits: ['add-to-portfolio'],
  setup(props, { emit }) {
    const amount = ref('');

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value || 0);
    };

    const formatCurrencyShort = (value) => {
      if (value >= 1e12) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: 'compact',
          compactDisplay: 'short'
        }).format(value);
      } else if (value >= 1e9) {
        return '$' + (value / 1e9).toFixed(1) + 'B';
      } else if (value >= 1e6) {
        return '$' + (value / 1e6).toFixed(1) + 'M';
      } else if (value >= 1e3) {
        return '$' + (value / 1e3).toFixed(1) + 'K';
      }
      return formatCurrency(value);
    };

    const addToPortfolio = () => {
      if (amount.value && parseFloat(amount.value) > 0) {
        emit('add-to-portfolio', {
          coinId: props.coin.id,
          amount: parseFloat(amount.value)
        });
        amount.value = '';
      }
    };

    return {
      amount,
      formatCurrency,
      formatCurrencyShort,
      addToPortfolio
    };
  }
}
</script>

<style scoped>
.coin-card {
  @apply bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 transition-all duration-300;
}

.coin-card:hover {
  @apply hover:bg-gray-800/70 hover:border-gray-600/50 scale-105;
}

.coin-header {
  @apply flex items-center gap-4 mb-6;
}

.coin-image {
  @apply w-12 h-12 rounded-full;
}

.coin-header h3 {
  @apply text-white font-bold text-lg truncate;
}

.coin-details {
  @apply mb-6;
}

.price {
  @apply text-2xl font-bold text-white mb-2;
}

.market-cap, .change {
  @apply flex items-center justify-between text-sm;
}

.market-cap span, .change span {
  @apply text-gray-400;
}

.change {
  @apply mt-1;
}

.positive {
  @apply text-emerald-400;
}

.negative {
  @apply text-red-400;
}

.coin-actions {
  @apply space-y-3;
}

.details-btn {
  @apply block w-full bg-gray-700/50 hover:bg-gray-600/50 text-white text-center py-3 rounded-xl font-medium transition-colors;
}

.portfolio-section {
  @apply flex gap-3;
}

.amount-input {
  @apply flex-1 px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.add-btn {
  @apply px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-300 whitespace-nowrap;
}
</style>