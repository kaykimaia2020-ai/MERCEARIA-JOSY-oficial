<template>
  <div class="cart">
    <h2>Carrinho de Compras</h2>
    <div v-if="cart.length === 0"><p>Carrinho vazio</p></div>
    <div v-else>
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <img :src="item.image" :alt="item.name" style="width:50px;">
        <div>
          <h3>{{ item.name }}</h3>
          <p>R$ {{ item.price }}</p>
          <p>Quantidade: {{ item.quantity }}</p>
          <button @click="removeFromCart(item.id)">Remover</button>
        </div>
      </div>
      <div class="total"><p>Total: R$ {{ cartTotal }}</p></div>
      <button @click="checkout">Finalizar Compra</button>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    cart() { return this.$store.state.cart; },
    cartTotal() { return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0); }
  },
  methods: {
    removeFromCart(productId) { this.$store.commit('REMOVE_FROM_CART', productId); },
    checkout() { alert('Compra finalizada!'); this.$store.commit('CLEAR_CART'); this.$router.push('/'); }
  }
};
</script>
