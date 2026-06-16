import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Products from '../views/Products.vue';
import Cart from '../views/Cart.vue';
import Admin from '../views/Admin.vue';
const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/cart', component: Cart },
  { path: '/admin', component: Admin }
];
const router = createRouter({ history: createWebHistory(), routes });
export default router;
