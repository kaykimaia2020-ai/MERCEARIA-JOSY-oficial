<template>
  <div class="admin">
    <h2>Painel Administrativo</h2>
    <div class="product-form">
      <h3>Adicionar Produto</h3>
      <form @submit.prevent="addProduct">
        <input v-model="newProduct.name" placeholder="Nome">
        <input v-model.number="newProduct.price" type="number" placeholder="Preço">
        <input v-model.number="newProduct.stock" type="number" placeholder="Estoque">
        <input v-model="newProduct.image" placeholder="Link da imagem">
        <button type="submit">Adicionar</button>
      </form>
    </div>
    <div class="products-list">
      <h3>Produtos</h3>
      <div v-for="product in products" :key="product.id" class="product-item">
        <div>
          <h4>{{ product.name }}</h4>
          <p>Preço: {{ product.price }} | Estoque: {{ product.stock }}</p>
          <button @click="deleteProduct(product.id)">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() { return { newProduct: { name: '', price: 0, stock: 0, image: '' }, products: [] }; },
  methods: {
    addProduct() {
      const product = { ...this.newProduct, id: Date.now() };
      this.products.push(product);
      this.newProduct = { name: '', price: 0, stock: 0, image: '' };
    },
    deleteProduct(id) { this.products = this.products.filter(p => p.id !== id); }
  }
};
</script>
