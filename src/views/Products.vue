<template>
  <div>
    <h2>Prateleira de Produtos</h2>
    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.image" :alt="product.name">
        <h3>{{ product.name }}</h3>
        <p style="color: gray; margin: 2px 0;">Marca: {{ product.brand }}</p>
        <p class="price" style="font-weight: bold; color: #2b2d42; font-size: 18px;">R$ {{ product.price.toFixed(2) }}</p>
        
        <!-- Validação de Estoque Visual -->
        <p v-if="product.stock > 0" style="color: #40c057; font-weight: 500;">Disponível: {{ product.stock }} un</p>
        <p v-else style="color: #e63946; font-weight: bold;">Esgotado</p>
        
        <button 
          @click="buy(product)" 
          :disabled="product.stock <= 0"
          :style="{ background: product.stock > 0 ? '#1d3557' : '#ced4da', color: 'white', width: '100%' }"
        >
          {{ product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: { products() { return this.$store.state.products; } },
  methods: {
    buy(product) {
      this.$store.commit('ADD_TO_CART', product);
      alert(`${product.name} foi adicionado ao carrinho!`);
    }
  }
};
</script>
