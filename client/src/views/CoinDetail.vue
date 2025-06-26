<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
    <Header />
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 lg:p-8 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
          <img v-if="coin.image" :src="coin.image" :alt="coin.name" class="w-16 h-16 lg:w-20 lg:h-20 rounded-full mx-auto lg:mx-0" />
          <div class="text-center lg:text-left">
            <h1 class="text-2xl lg:text-4xl font-bold text-white mb-2">
              {{ coin.name }} 
              <span class="text-gray-400 text-lg lg:text-2xl">({{ coin.symbol?.toUpperCase() }})</span>
            </h1>
            <div class="flex flex-col lg:flex-row lg:items-center gap-4">
              <span class="text-2xl lg:text-3xl font-bold text-white">{{ formatCurrency(coin.current_price) }}</span>
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
                   :class="coin.price_change_percentage_24h >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'">
                <span>{{ coin.price_change_percentage_24h?.toFixed(2) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-gray-700/30 rounded-xl p-4">
            <div class="text-gray-400 text-sm mb-1">Market Cap</div>
            <div class="text-white text-xl font-bold">{{ formatCurrency(coin.market_cap) }}</div>
          </div>
          <div class="bg-gray-700/30 rounded-xl p-4">
            <div class="text-gray-400 text-sm mb-1">24h Volume</div>
            <div class="text-white text-xl font-bold">{{ formatCurrency(coin.total_volume) }}</div>
          </div>
          <div class="bg-gray-700/30 rounded-xl p-4">
            <div class="text-gray-400 text-sm mb-1">Circulating Supply</div>
            <div class="text-white text-xl font-bold">{{ formatNumber(coin.circulating_supply) }}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 lg:p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl lg:text-2xl font-bold text-white">Price Chart</h2>
            <div class="flex gap-2">
              <button 
                v-for="period in chartPeriods" 
                :key="period.value"
                @click="changePeriod(period.value)"
                :class="[
                  'px-3 py-1 text-xs font-medium rounded-lg transition-colors',
                  selectedPeriod === period.value 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                ]">
                {{ period.label }}
              </button>
            </div>
          </div>
          <div class="bg-gray-700/20 rounded-xl p-4 relative" style="height: 400px;">
            <canvas ref="chartCanvas" class="w-full h-full"></canvas>
            <div v-if="chartLoading" class="absolute inset-0 flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 lg:p-8">
          <h2 class="text-xl lg:text-2xl font-bold text-white mb-6">Historical Data</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-700/50">
                  <th class="text-left text-gray-400 text-sm font-medium py-3">Date</th>
                  <th class="text-right text-gray-400 text-sm font-medium py-3">Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700/30">
                <tr v-if="historicalData.length === 0" class="hover:bg-gray-700/20">
                  <td colspan="2" class="text-center text-gray-400 py-8">Loading historical data...</td>
                </tr>
                <tr v-for="data in historicalData.slice(0, 10)" :key="data.date" class="hover:bg-gray-700/20">
                  <td class="text-gray-300 py-3">{{ formatDate(data.date) }}</td>
                  <td class="text-white font-semibold text-right py-3">{{ formatCurrency(data.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { fetchCoinDetail, fetchHistoricalData } from '../services/api';
import Header from '../components/Header.vue';

export default {
  name: 'CoinDetail',
  components: {
    Header
  },
  setup() {
    const route = useRoute();
    const coin = ref({});
    const historicalData = ref([]);
    const chartCanvas = ref(null);
    const chartLoading = ref(false);
    const selectedPeriod = ref(7);
    let chartInstance = null;

    const chartPeriods = [
      { label: '7D', value: 7 },
      { label: '30D', value: 30 },
      { label: '90D', value: 90 },
      { label: '1Y', value: 365 }
    ];

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value || 0);
    };

    const formatNumber = (value) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value || 0);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const loadChart = async () => {
      try {
        // Try to import Chart.js
        let Chart, registerables;
        try {
          const chartModule = await import('chart.js');
          Chart = chartModule.Chart;
          registerables = chartModule.registerables;
        } catch (importError) {
          console.warn('Chart.js not available, creating simple chart fallback');
          createFallbackChart();
          return;
        }

        if (!Chart || !registerables) {
          createFallbackChart();
          return;
        }

        Chart.register(...registerables);

        if (!chartCanvas.value || !historicalData.value.length) return;

        // Destroy existing chart
        if (chartInstance) {
          chartInstance.destroy();
        }

        const ctx = chartCanvas.value.getContext('2d');
        
        // Prepare data
        const labels = historicalData.value.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        const prices = historicalData.value.map(item => item.price);
        
        // Determine gradient colors based on price trend
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const isPositive = lastPrice >= firstPrice;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        if (isPositive) {
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
        } else {
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)');
        }

        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Price',
              data: prices,
              borderColor: isPositive ? '#10b981' : '#ef4444',
              backgroundColor: gradient,
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointBackgroundColor: isPositive ? '#10b981' : '#ef4444',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(75, 85, 99, 0.5)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                  title: function(context) {
                    const index = context[0].dataIndex;
                    return formatDate(historicalData.value[index].date);
                  },
                  label: function(context) {
                    return `Price: ${formatCurrency(context.parsed.y)}`;
                  }
                }
              }
            },
            scales: {
              x: {
                display: true,
                grid: {
                  display: false
                },
                ticks: {
                  color: '#9ca3af',
                  maxTicksLimit: 8
                }
              },
              y: {
                display: true,
                grid: {
                  color: 'rgba(75, 85, 99, 0.2)',
                  borderDash: [5, 5]
                },
                ticks: {
                  color: '#9ca3af',
                  callback: function(value) {
                    return formatCurrency(value);
                  }
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
            },
            hover: {
              intersect: false
            }
          }
        });
      } catch (error) {
        console.error('Error loading chart:', error);
        createFallbackChart();
      }
    };

    const createFallbackChart = () => {
      if (!chartCanvas.value || !historicalData.value.length) return;

      const ctx = chartCanvas.value.getContext('2d');
      const canvasWidth = chartCanvas.value.width;
      const canvasHeight = chartCanvas.value.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Set canvas size
      ctx.canvas.width = canvasWidth;
      ctx.canvas.height = canvasHeight;

      const prices = historicalData.value.map(item => item.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceRange = maxPrice - minPrice;

      // Draw simple line chart
      ctx.beginPath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;

      prices.forEach((price, index) => {
        const x = (index / (prices.length - 1)) * (canvasWidth - 60) + 30;
        const y = canvasHeight - 30 - ((price - minPrice) / priceRange) * (canvasHeight - 60);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Add labels
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      
      // Price labels
      ctx.fillText(formatCurrency(maxPrice), 15, 30);
      ctx.fillText(formatCurrency(minPrice), 15, canvasHeight - 30);
      
      // Add title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Price Chart (Fallback)', canvasWidth / 2, 20);
    };

    const changePeriod = async (days) => {
      selectedPeriod.value = days;
      await loadHistoricalData(days);
    };

    const loadHistoricalData = async (days = 7) => {
      const coinId = route.params.id;
      chartLoading.value = true;
      
      try {
        historicalData.value = await fetchHistoricalData(coinId, days);
        await nextTick();
        await loadChart();
      } catch (error) {
        console.error('Error loading historical data:', error);
        // Generate sample data as fallback
        historicalData.value = generateSampleData(days);
        await nextTick();
        await loadChart();
      } finally {
        chartLoading.value = false;
      }
    };

    const generateSampleData = (days) => {
      const data = [];
      const currentPrice = coin.value.current_price || 50000;
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Generate price with some volatility
        const volatility = 0.05; // 5% daily volatility
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const price = currentPrice * (1 + randomChange * (i / days));
        
        data.push({
          date: date.toISOString().split('T')[0],
          price: Math.max(price, currentPrice * 0.5) // Prevent negative prices
        });
      }
      
      return data;
    };

    const loadCoinData = async () => {
      const coinId = route.params.id;
      
      try {
        coin.value = await fetchCoinDetail(coinId);
        await loadHistoricalData(selectedPeriod.value);
      } catch (error) {
        console.error('Error loading coin data:', error);
        // Set fallback data
        coin.value = {
          name: 'Sample Coin',
          symbol: 'SAMPLE',
          current_price: 50000,
          market_cap: 1000000000,
          total_volume: 50000000,
          circulating_supply: 20000,
          price_change_percentage_24h: 5.5,
          image: 'https://via.placeholder.com/64'
        };
        await loadHistoricalData(selectedPeriod.value);
      }
    };

    onMounted(loadCoinData);

    return {
      coin,
      historicalData,
      chartCanvas,
      chartLoading,
      selectedPeriod,
      chartPeriods,
      formatCurrency,
      formatNumber,
      formatDate,
      changePeriod,
    };
  },
};
</script>

<style scoped>
.coin-detail {
  padding: 20px;
}

.coin-info {
  margin-bottom: 20px;
}

.price-chart {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>