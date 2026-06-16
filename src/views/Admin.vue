<template>
  <div class="admin-page">
    <h2>Painel Administrativo da Gerência</h2>

    <!-- TELA DE LOGIN (SÓ MOSTRA SE NÃO ESTIVER LOGADO) -->
    <div v-if="!isLogged" class="admin-card login-box">
      <h3>Acesso Restrito</h3>
      <p>Digite a senha master para gerenciar a Mercearia Josy:</p>
      <input 
        v-model="passwordInput" 
        type="password" 
        placeholder="Digite sua senha" 
        @keyup.enter="checkPassword"
      >
      <button @click="checkPassword" style="background: var(--secondary); color: white; width: 100%;">
        Entrar no Painel
      </button>
    </div>

    <!-- PAINEL COMPLETO (SÓ MOSTRA SE A SENHA ESTIVER CORRETA) -->
    <div v-else>
      <div style="text-align: right; margin-bottom: 10px;">
        <button @click="logout" style="background: #dee2e6; color: #495057; padding: 5px 10px;">Sair do Painel</button>
      </div>

      <!-- Seção 1: Adicionar Itens -->
      <div class="admin-card">
        <h3>Novo Produto</h3>
        <form @submit.prevent="saveProduct" class="admin-form">
          <div class="form-group">
            <input v-model="newProd.name" placeholder="Nome do Produto (Ex: Óleo de Soja)" required>
            <input v-model="newProd.brand" placeholder="Marca (Ex: Liza)" required>
          </div>
          <div class="form-group">
            <input v-model.number="newProd.price" type="number" step="0.01" placeholder="Preço (R$)" required>
            <input v-model.number="newProd.stock" type="number" placeholder="Estoque Inicial" required>
          </div>
          <input v-model="newProd.image" placeholder="Link da imagem na Internet" required>
          <button type="submit" class="save-btn">Cadastrar na Prateleira</button>
        </form>
      </div>

      <!-- Seção 2: Monitoramento de Vendas -->
      <div class="admin-card text-left">
        <h3>📈 Relatório de Pedidos / Compras Feitas</h3>
        <div v-if="orders.length === 0" class="no-orders">Nenhum pedido feito hoje ainda.</div>
        <div v-else class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-log-card">
            <div class="order-header">
              <span>📅 <strong>Data/Hora:</strong> {{ order.date }}</span>
              <span class="badge-payment">{{ order.customer.paymentMethod.toUpperCase() }}</span>
            </div>
            <div class="order-body">
              <p>🏠 <strong>Local:</strong> {{ order.customer.block }} - {{ order.customer.apartment }}</p>
              <p>⏰ <strong>Horário de Retirada escolhido:</strong> {{ order.customer.pickupTime }} hs</p>
              <div class="order-items">
                <strong>Itens comprados:</strong>
                <ul>
                  <li v-for="item in order.items" :key="item.id">
                    {{ item.quantity }}x - {{ item.name }} ({{ item.brand }}) - R$ {{ (item.price * item.quantity).toFixed(2) }}
                  </li>
                </ul>
              </div>
              <div class="order-total">Valor Total: R$ {{ order.total.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção 3: Estoque Atual da Loja -->
      <div class="admin-card">
        <h3>Prateleira Atual (Gerenciar Estoque)</h3>
        <div class="admin-stock-list">
          <div v-for="p in products" :key="p.id" class="stock-item">
            <span><strong>{{ p.name }}</strong> ({{ p.brand }}) - Preço: R$ {{ p.price.toFixed(2) }} | 📦 Estoque: {{ p.stock }} un</span>
            <button @click="removeProduct(p.id)" class="delete-btn">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogged: false,
      passwordInput: '',
      // SUA SENHA ESTÁ CONFIGURADA NESSA LINHA ABAIXO:
      correctPassword: 'josyadm123', 
      newProd: { name: '', brand: '', price: null, stock: null, image: '' }
    };
  },
  computed: {
    products() { return this.$store.state.products; },
    orders() { return this.$store.state.orders; }
  },
  methods: {
    checkPassword() {
      if (this.passwordInput === this.correctPassword) {
        this.isLogged = true;
      } else {
        alert('Senha incorreta! Tente novamente.');
        this.passwordInput = '';
      }
    },
    logout() {
      this.isLogged = false;
      this.passwordInput = '';
    },
    saveProduct() {
      this.$store.commit('ADD_PRODUCT', { ...this.newProd, id: Date.now() });
      this.newProd = { name: '', brand: '', price: null, stock: null, image: '' };
      alert('Produto adicionado ao estoque!');
    },
    removeProduct(id) {
      if(confirm('Deseja retirar esse produto da prateleira?')) {
        this.$store.commit('DELETE_PRODUCT', id);
      }
    }
  }
};
</script>

<style scoped>
.login-box { max-width: 400px; margin: 50px auto; text-align: center; }
.admin-card { background: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.form-group { display: flex; gap: 15px; }
.save-btn { background: var(--secondary); color: white; width: 100%; font-size: 16px; margin-top: 10px; }
.delete-btn { background: #ffe3e3; color: #c92a2a; padding: 5px 10px; font-size: 12px; }
.stock-item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0; }
.order-log-card { background: #f8f9fa; border-left: 5px solid var(--primary); padding: 15px; border-radius: 4px; margin-top: 15px; border: 1px solid #e9ecef; border-left-width: 6px; }
.order-header { display: flex; justify-content: space-between; border-bottom: 1px solid #dee2e6; padding-bottom: 5px; margin-bottom: 10px; }
.badge-payment { background: #e63946; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
.order-total { text-align: right; font-weight: bold; color: var(--secondary); font-size: 16px; margin-top: 10px; border-top: 1px dashed #dee2e6; padding-top: 5px; }
</style>
