<template>
  <header class="header">
    <h1>MERCEARIA JOSY</h1>
    <nav>
      <router-link to="/">Home</router-link> | 
      <router-link to="/products">Produtos</router-link> | 
      <router-link to="/cart">Carrinho ({{ cartCount }})</router-link> | 
      <router-link to="/admin">Admin</router-link>
    </nav>
  </header>
</template>
<script>
export default {
  computed: { cartCount() { return this.$store.state.cart.length; } }
};
</script>
