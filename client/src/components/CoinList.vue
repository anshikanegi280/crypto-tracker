<template>
  <div class="space-y-6 lg:space-y-8">
    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="text-center py-16">
      <div class="text-red-400 text-lg font-semibold">{{ error }}</div>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
      <CoinCard
        v-for="coin in filteredCoins"
        :key="coin.id"
        :coin="coin"
        @add-to-portfolio="handleAddToPortfolio"
      />
    </div>
  </div>
</template>

<script>
import CoinCard from './CoinCard.vue';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'CoinList',
  components: {
    CoinCard,
  },
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const store = useStore();

    const cryptocurrencies = computed(() => store.getters.allCryptocurrencies);
    const isLoading = computed(() => store.getters.isLoading);
    const error = computed(() => store.getters.error);

    const filteredCoins = computed(() => {
      if (!props.searchQuery) return cryptocurrencies.value;
      return cryptocurrencies.value.filter(coin => 
        coin.name.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(props.searchQuery.toLowerCase())
      );
    });

    const handleAddToPortfolio = async (coinData) => {
      try {
        await store.dispatch('addCoinToPortfolio', coinData);
        alert(`Added ${coinData.amount} ${coinData.coinId} to portfolio!`);
      } catch (error) {
        alert('Failed to add coin to portfolio: ' + error.message);
      }
    };

    onMounted(() => {
      store.dispatch('fetchCryptocurrencies');
    });

    return {
      filteredCoins,
      isLoading,
      error,
      handleAddToPortfolio,
    };
  },
};
</script>

<style scoped>
.coin-list {
  padding: 20px;
}

.coin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error {
  color: red;
}
</style>