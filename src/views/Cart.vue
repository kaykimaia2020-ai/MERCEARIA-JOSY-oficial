<template>
  <div class="admin-page">
    <h2>Painel Administrativo da Gerência</h2>

    <!-- TELA DE LOGIN (SÓ MOSTRA SE NÃO ESTIVER LOGADO) -->
    <div v-if="!isLogged" class="admin-card login-box">
      <h3>Acesso Restrito</h3>
      <p>Digite a senha master para gerenciar a Mercearia Josy:</p>
      <input 
        v-model="passInput" 
        type="password" 
        placeholder="Digite a senha master" 
        @keyup.enter="login"
      >
      <button @click="login" style="background: #1d3557; color: white; width: 100%;">
        Entrar
      </button>
    </div>

    <!-- PAINEL COMPLETO (SÓ MOSTRA SE A SENHA ESTIVER CORRETA) -->
    <div v-else>
      <div style="text-align: right; margin-bottom: 10px;">
        <button @click="isLogged = false" style="background: #dee2e6; color: #495057; padding: 5px 10px;">Sair do Painel</button>
      </div>

      <!-- Seção 1: Adicionar Itens -->
      <div class="admin-card text-left">
        <h3>Novo Produto</h3>
        <form @submit.prevent="save">
          <input v-model="newP.name" placeholder="Nome do Produto (Ex: Óleo de Soja)" required>
          <input v-model="newP.brand" placeholder="Marca (Ex: Liza)" required>
          <input v-model.number="newP.price" type="number" step="0.01" placeholder="Preço (R$)" required>
          <input v-model.number="newProdStock" type="number" placeholder="Estoque Inicial" required>
          <input v-model="newP.image" placeholder="Link da Imagem na Internet" required>
          <button type="submit" style="background: #1d3557; color: white; width: 100%;">Cadastrar na Prateleira</button>
        </form>
      </div>

      <!-- Seção 2: Monitoramento de Vendas (O que as pessoas compraram) -->
      <div class="admin-card text-left">
        <h3>📈 Relatório de Pedidos Feitos (Vendas)</h3>
        <div v-if="orders.length === 0">Nenhum pedido feito hoje.</div>
        <div v-else>
          <div v-for="o in orders" :key="o.id" class="order-card">
            <p>📅 <strong>Data:</strong> {{ o.date }} | 💰 <strong>Total:</strong> R$ {{ o.total.toFixed(2) }} | <span class="badge">{{ o.customer.paymentMethod.toUpperCase() }}</span></p>
            <p>🏠 <strong>Apartamento:</strong> {{ o.customer.block }} - {{ o.customer.apartment }} | ⏰ <strong>Retirada:</strong> {{ o.customer.pickupTime }} hs</p>
            <strong>Itens comprados:</strong>
            <ul>
              <li v-for="i in o.items" :key="i.id">
                {{ i.quantity }}x - {{ i.name }} ({{ i.brand }})
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Seção 3: Estoque Atual da Loja -->
      <div class="admin-card text-left">
        <h3>Gerenciar Estoque</h3>
        <div v-for="p in products" :key="p.id" class="stock-item">
          <span><strong>{{ p.name }}</strong> ({{ p.brand }}) - Estoque: {{ p.stock }} un - Preço: R$ {{ p.price.toFixed(2) }}</span>
          <button @click="del(p.id)" class="del-btn">Excluir</button>
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
      passInput: '',
      passCorrect: 'josyadm123',
      newProdStock: null,
      newP: { name: '', brand: '', price: null, image: '' }
    };
  },
  computed: {
    products() {
      return this.$store.state.products;
    },
    orders() {
      return this.$store.state.orders;
    }
  },
  methods: {
    login() {
      if (this.passInput === this.passCorrect) {
        this.isLogged = true;
      } else {
        alert('Senha errada!');
        this.passInput = '';
      }
    },
    save() {
      this.$store.commit('ADD_PRODUCT', {
        ...this.newP,
        stock: this.newProdStock,
        id: Date.now()
      });
      this.newP = { name: '', brand: '', price: null, image: '' };
      this.newProdStock = null;
      alert('Produto cadastrado com sucesso!');
    },
    del(id) {
      if (confirm('Deseja excluir esse item da prateleira?')) {
        this.$store.commit('DELETE_PRODUCT', id);
      }
    }
  }
};
</script>

<style scoped>
.login-box { max-width: 350px; margin: 40px auto; text-align: center; }
.admin-card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.text-left { text-align: left; }
.order-card { background: #f8f9fa; border-left: 5px solid #e63946; padding: 10px; margin-top: 10px; border-radius: 4px; border: 1px solid #dee2e6; border-left-width: 6px; }
.badge { background: #e63946; color: white; padding: 2px 5px; border-radius: 3px; font-size: 11px; font-weight: bold; }
.stock-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; align-items: center; }
.del-btn { background: #ffe3e3; color: #c92a2a; font-size: 11px; padding: 3px 8px; border: none; border-radius: 4px; cursor: pointer; }
</style>
