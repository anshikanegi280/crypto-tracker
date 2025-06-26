<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
    <Header />
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div class="text-center mb-8 lg:mb-12">
        <h1 class="text-3xl lg:text-5xl font-bold text-white mb-4">
          Discover <span class="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Cryptocurrencies</span>
        </h1>
        <p class="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto">
          Track, analyze, and manage your crypto portfolio with real-time data and insights
        </p>
      </div>
      <SearchBar @search="handleSearch" />
      <CoinList :searchQuery="searchQuery" />
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import SearchBar from '../components/SearchBar.vue';
import CoinList from '../components/CoinList.vue';

export default {
  name: 'Home',
  components: {
    Header,
    SearchBar,
    CoinList
  },
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    handleSearch(query) {
      this.searchQuery = query;
    }
  }
};
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>