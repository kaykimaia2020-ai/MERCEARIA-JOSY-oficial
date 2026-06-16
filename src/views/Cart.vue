<template>
  <div class="cart-page">
    <h2>Seu Carrinho de Compras</h2>

    <div v-if="cart.length === 0" class="empty-msg">
      <p>O seu carrinho está vazio no momento.</p>
      <router-link to="/products"><button style="background: var(--secondary); color: white;">Ver Produtos</button></router-link>
    </div>

    <div v-else-if="!checkoutSuccess" class="cart-layout">
      <!-- Lista de Itens -->
      <div class="items-section">
        <div v-for="item in cart" :key="item.id" class="cart-item-card">
          <img :src="item.image" :alt="item.name">
          <div class="item-details">
            <h3>{{ item.name }} ({{ item.brand }})</h3>
            <p class="price">R$ {{ item.price.toFixed(2) }}</p>
            <p>Qtd: {{ item.quantity }}</p>
            <button @click="remove(item.id)" class="remove-btn">Remover</button>
          </div>
        </div>
      </div>

      <!-- Formulário de Retirada e Pagamento -->
      <div class="checkout-section">
        <h3>Dados de Retirada</h3>
        
        <label>Bloco:</label>
        <input v-model="form.block" placeholder="Ex: Bloco B" required>

        <label>Apartamento:</label>
        <input v-model="form.apartment" placeholder="Ex: Apto 302" required>

        <label>Horário Programado para Buscar:</label>
        <input v-model="form.pickupTime" type="time" required>

        <label>Forma de Pagamento:</label>
        <select v-model="form.paymentMethod">
          <option value="pix">PIX (Pague Online)</option>
          <option value="credito">Cartão de Crédito (Na retirada)</option>
          <option value="debito">Cartão de Débito (Na retirada)</option>
          <option value="especie">Espécie / Dinheiro (Na retirada)</option>
        </select>

        <div class="total-box">
          <span>Total Geral:</span>
          <strong>R$ {{ cartTotal.toFixed(2) }}</strong>
        </div>

        <button @click="processCheckout" class="submit-order-btn">Confirmar e Finalizar</button>
      </div>
    </div>

    <!-- Tela Direcionada de PIX / Sucesso -->
    <div v-else class="pix-screen">
      <div class="success-icon">✅</div>
      <h2>Pedido Confirmado com Sucesso!</h2>
      <p>Seu pedido foi enviado para a gerência da Mercearia Josy.</p>
      
      <div v-if="form.paymentMethod === 'pix'" class="pix-box">
        <h3>PAGAMENTO VIA PIX EXIGIDO</h3>
        <p>Transfira o valor exato de <strong>R$ {{ totalPago.toFixed(2) }}</strong> para a chave abaixo:</p>
        <div class="pix-key">CNPJ: 35.708.277/0001-58</div>
        <small>Identificação da conta: Mercearia Josy</small>
      </div>

      <div class="pickup-reminder">
        <p>🏠 Lembre-se de comparecer para retirar no horário agendado: <strong>{{ form.pickupTime }} hs</strong>.</p>
      </div>
      <button @click="resetPage" style="background: var(--secondary); color: white;">Voltar ao Início</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkoutSuccess: false,
      totalPago: 0,
      form: { block: '', apartment: '', pickupTime: '', paymentMethod: 'pix' }
    };
  },
  computed: {
    cart() { return this.$store.state.cart; },
    cartTotal() { return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0); }
  },
  methods: {
    remove(id) { this.$store.commit('REMOVE_FROM_CART', id); },
    processCheckout() {
      if (!this.form.block || !this.form.apartment || !this.form.pickupTime) {
        alert('Por favor, preencha o bloco, apartamento e o horário de retirada!');
        return;
      }
      this.totalPago = this.cartTotal;
      this.$store.commit('FINALIZAR_PEDIDO', {
        items: [...this.cart],
        total: this.cartTotal,
        customer: { ...this.form }
      });
      this.checkoutSuccess = true;
    },
    resetPage() {
      this.checkoutSuccess = false;
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.cart-layout { display: flex; gap: 30px; flex-wrap: wrap; margin-top: 20px; }
.items-section { flex: 2; min-width: 300px; display: flex; flex-direction: column; gap: 15px; }
.checkout-section { flex: 1; min-width: 300px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.cart-item-card { display: flex; background: white; padding: 15px; border-radius: 8px; gap: 15px; border: 1px solid #e9ecef; }
.cart-item-card img { width: 80px; height: 80px; object-fit: contain; }
.remove-btn { background: #ffc9c9; color: #c92a2a; font-size: 12px; margin-top: 5px; }
.total-box { display: flex; justify-content: space-between; font-size: 18px; margin: 20px 0; border-top: 2px dashed #dee2e6; padding-top: 15px; }
.submit-order-btn { background: #40c057; color: white; width: 100%; font-size: 16px; }
.pix-screen { text-align: center; background: white; padding: 40px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.pix-box { background: #e7f5ff; border: 2px solid #339af0; padding: 20px; border-radius: 8px; margin: 20px 0; }
.pix-key { font-size: 20px; font-weight: bold; color: #1c7ed6; background: white; padding: 10px; border-radius: 5px; margin-top: 10px; border: 1px dashed #339af0; }
</style>
