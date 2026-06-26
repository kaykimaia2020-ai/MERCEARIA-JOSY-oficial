<template>
  <div id="app" class="store-container">
    <!-- Cabeçalho Principal -->
    <header class="main-header">
      <div class="header-content">
        <h1 class="brand-title">🛒 MERCEARIA JOSY</h1>
        <nav class="nav-menu">
          <router-link to="/" class="nav-link">Início</router-link>
          <router-link to="/products" class="nav-link">Produtos</router-link>
          <router-link to="/cart" class="nav-link">Carrinho ({{ cartCount }})</router-link>
          <router-link to="/admin" class="nav-link admin-btn">Painel Adm</router-link>
        </nav>
      </div>
    </header>

    <!-- Alertas Importantes da Loja -->
    <div class="store-alerts">
      <div class="alert-banner delivery-warning">⚠️ ATENÇÃO: Não fazemos entregas. Retirada no local.</div>
      <div class="alert-banner hours-info">⏰ Aberto de Segunda a Sábado, das 07:00 às 20:00</div>
    </div>

    <!-- Conteúdo da Página -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  computed: {
    cartCount() {
      return this.$store.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
  },
  mounted() {
    // Carrega dados iniciais do estoque
    this.$store.commit('INITIALIZE_STORE');

    // Faz a chamada silenciosa para capturar e salvar o IP na Vercel
    fetch('/api/registrar-ip')
      .catch(error => console.error("Erro ao registrar IP:", error));
  }
};
</script>

<style>
/* Estética Moderna do Site */
:root {
  --primary: #e63946;
  --secondary: #1d3557;
  --background: #f8f9fa;
  --card-bg: #ffffff;
  --text: #2b2d42;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Roboto, sans-serif;
  background-color: var(--background);
  color: var(--text);
}

.store-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-header {
  background-color: var(--secondary);
  color: white;
  padding: 15px 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.brand-title {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 1px;
}

.nav-menu {
  display: flex;
  gap: 15px;
}

.nav-link {
  color: #f1faee;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 5px;
  transition: 0.3s;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.1);
}

.admin-btn {
  background-color: var(--primary);
}

.admin-btn:hover {
  background-color: #bd2130;
}

.store-alerts {
  max-width: 1200px;
  margin: 15px auto 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 20px;
  box-sizing: border-box;
}

.alert-banner {
  padding: 10px 15px;
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
}

.delivery-warning {
  background-color: #ffe3e3;
  color: #c92a2a;
  border: 1px solid #ffa8a8;
}

.hours-info {
  background-color: #e3fafc;
  color: #0c8599;
  border: 1px solid #99e9f2;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* Estilos de Botões Universais */
button {
  cursor: pointer;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  transition: 0.2s;
}

input, select {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  text-align: center;
  border: 1px solid #e9ecef;
}

.product-card img {
  max-width: 100%;
  height: 180px;
  object-fit: contain;
}
</style>
