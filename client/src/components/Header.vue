<template>
  <header class="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-lg lg:text-xl">₿</span>
            </div>
            <h1 class="text-xl lg:text-2xl font-bold text-white">CryptoTracker</h1>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <router-link to="/" 
                       class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                       :class="$route.path === '/' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'">
            Overview
          </router-link>
          <router-link to="/portfolio" 
                       class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                       :class="$route.path === '/portfolio' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'">
            Portfolio
          </router-link>
          <div class="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">Holdings</div>
          <div class="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">Transactions</div>
          <div class="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">P&L</div>
        </nav>

        <!-- User Section -->
        <div class="flex items-center gap-4">
          <div class="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700/50 cursor-pointer hover:bg-gray-700/50 transition-colors">
            <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-semibold">A</span>
            </div>
            <span class="text-white font-medium">Alex Savaiko</span>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" 
                  class="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    :d="mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-700/50 py-4">
        <nav class="flex flex-col space-y-2">
          <router-link to="/" 
                       @click="mobileMenuOpen = false"
                       class="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300"
                       :class="$route.path === '/' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'">
            Overview
          </router-link>
          <router-link to="/portfolio" 
                       @click="mobileMenuOpen = false"
                       class="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300"
                       :class="$route.path === '/portfolio' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'">
            Portfolio
          </router-link>
          <div class="px-4 py-3 text-sm font-medium text-gray-400">Holdings</div>
          <div class="px-4 py-3 text-sm font-medium text-gray-400">Transactions</div>
          <div class="px-4 py-3 text-sm font-medium text-gray-400">P&L</div>
        </nav>
        
        <div class="mt-4 pt-4 border-t border-gray-700/50">
          <div class="flex items-center gap-3 px-4 py-2">
            <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-semibold">A</span>
            </div>
            <span class="text-white font-medium">Alex Savaiko</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Header',
  setup() {
    const mobileMenuOpen = ref(false)
    
    return {
      mobileMenuOpen
    }
  }
}
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>