import { createStore } from 'vuex';
export default createStore({
  state: { products: [], cart: [], adminMode: false },
  mutations: {
    SET_PRODUCTS(state, products) { state.products = products; },
    ADD_TO_CART(state, product) {
      const existing = state.cart.find(p => p.id === product.id);
      if (existing) { existing.quantity++; } else { state.cart.push({ ...product, quantity: 1 }); }
    },
    REMOVE_FROM_CART(state, productId) { state.cart = state.cart.filter(p => p.id !== productId); },
    CLEAR_CART(state) { state.cart = []; },
    SET_ADMIN_MODE(state, mode) { state.adminMode = mode; }
  }
});
