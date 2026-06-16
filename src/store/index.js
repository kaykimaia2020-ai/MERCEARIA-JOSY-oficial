import { createStore } from 'vuex';

export default createStore({
  state: {
    // Produtos iniciais preenchidos como exemplo de mercado
    products: [
      { id: 1, name: 'Arroz Integral', brand: 'Tio João', price: 6.50, stock: 20, image: 'https://unsplash.com' },
      { id: 2, name: 'Feijão Carioca', brand: 'Kicaldo', price: 7.80, stock: 15, image: 'https://unsplash.com' }
    ],
    cart: [],
    orders: [] // Guarda as vendas finalizadas para o Admin consultar
  },
  mutations: {
    INITIALIZE_STORE(state) {
      const savedProducts = localStorage.getItem('josy_products');
      const savedOrders = localStorage.getItem('josy_orders');
      if (savedProducts) state.products = JSON.parse(savedProducts);
      if (savedOrders) state.orders = JSON.parse(savedOrders);
    },
    ADD_PRODUCT(state, product) {
      state.products.push(product);
      localStorage.setItem('josy_products', JSON.stringify(state.products));
    },
    DELETE_PRODUCT(state, id) {
      state.products = state.products.filter(p => p.id !== id);
      localStorage.setItem('josy_products', JSON.stringify(state.products));
    },
    ADD_TO_CART(state, product) {
      const item = state.cart.find(p => p.id === product.id);
      const originalProduct = state.products.find(p => p.id === product.id);
      
      if (originalProduct && originalProduct.stock > 0) {
        if (item) {
          if (item.quantity < originalProduct.stock) item.quantity++;
        } else {
          state.cart.push({ ...product, quantity: 1 });
        }
      }
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter(p => p.id !== productId);
    },
    FINALIZAR_PEDIDO(state, payload) {
      // Baixar estoque dos itens comprados
      payload.items.forEach(cartItem => {
        const product = state.products.find(p => p.id === cartItem.id);
        if (product) {
          product.stock -= cartItem.quantity;
        }
      });
      
      // Registrar o pedido no painel de vendas
      state.orders.push({
        id: Date.now(),
        date: new Date().toLocaleString('pt-BR'),
        ...payload
      });
      
      // Salvar tudo de forma segura
      state.cart = [];
      localStorage.setItem('josy_products', JSON.stringify(state.products));
      localStorage.setItem('josy_orders', JSON.stringify(state.orders));
    }
  }
});
