import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CoinDetail from '../views/CoinDetail.vue';
import Portfolio from '../views/Portfolio.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/coin/:id',
    name: 'CoinDetail',
    component: CoinDetail,
    props: true
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: Portfolio
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;