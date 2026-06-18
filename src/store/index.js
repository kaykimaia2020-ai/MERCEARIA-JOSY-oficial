import { createStore } from 'vuex';

// Funções de Segurança (Criptografia Base64 para proteger o banco de dados)
const criptografar = (dado) => btoa(unescape(encodeURIComponent(JSON.stringify(dado))));
const descriptografar = (stringCriptografada) => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(stringCriptografada))));
  } catch (e) {
    return null;
  }
};

export default createStore({
  state: {
    products: [],
    cart: [],
    orders: []
  },
  mutations: {
    INITIALIZE_STORE(state) {
      const pSalvos = localStorage.getItem('josy_secure_p');
      const oSalvos = localStorage.getItem('josy_secure_o');
      
      // Se já existirem dados criptografados, descriptografa. Se não, inicia prateleira padrão.
      if (pSalvos) {
        const dadosDecodificados = descriptografar(pSalvos);
        if (dadosDecodificados) state.products = dadosDecodificados;
      } else {
        state.products = [
          { id: 1, name: 'Arroz Integral 1kg', brand: 'Tio João', price: 6.50, stock: 20, image: 'https://unsplash.com' },
          { id: 2, name: 'Feijão Carioca 1kg', brand: 'Kicaldo', price: 7.80, stock: 15, image: 'https://unsplash.com' }
        ];
        localStorage.setItem('josy_secure_p', criptografar(state.products));
      }

      if (oSalvos) {
        const ordDecodificados = descriptografar(oSalvos);
        if (ordDecodificados) state.orders = ordDecodificados;
      }
    },
    ADD_PRODUCT(state, prod) {
      state.products.push(prod);
      localStorage.setItem('josy_secure_p', criptografar(state.products));
    },
    DELETE_PRODUCT(state, id) {
      state.products = state.products.filter(p => p.id !== id);
      localStorage.setItem('josy_secure_p', criptografar(state.products));
    },
    ADD_TO_CART(state, prod) {
      const item = state.cart.find(p => p.id === prod.id);
      const orig = state.products.find(p => p.id === prod.id);
      if (orig && orig.stock > 0) {
        if (item) {
          if (item.quantity < orig.stock) item.quantity++;
        } else {
          state.cart.push({ ...prod, quantity: 1 });
        }
      }
    },
    REMOVE_FROM_CART(state, id) {
      state.cart = state.cart.filter(p => p.id !== id);
    },
    FINALIZAR_PEDIDO(state, payload) {
      payload.items.forEach(cItem => {
        const prod = state.products.find(p => p.id === cItem.id);
        if (prod) prod.stock -= cItem.quantity;
      });
      state.orders.push({ id: Date.now(), date: new Date().toLocaleString('pt-BR'), ...payload });
      state.cart = [];
      localStorage.setItem('josy_secure_p', criptografar(state.products));
      localStorage.setItem('josy_secure_o', criptografar(state.orders));
    },
    // NOVA FUNÇÃO: Limpa a lista de pedidos no painel
    LIMPAR_PEDIDOS(state) {
      state.orders = [];
      localStorage.setItem('josy_secure_o', criptografar(state.orders));
    }
  }
});
