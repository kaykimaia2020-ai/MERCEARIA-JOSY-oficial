<template>
  <div class="cart-page">
    <h2>Seu Carrinho</h2>
    <div v-if="cart.length === 0" class="empty-msg"><p>Seu carrinho está vazio.</p></div>
    <div v-else-if="!success" class="cart-layout">
      <!-- Lista de itens no carrinho -->
      <div class="items-section">
        <div v-for="item in cart" :key="item.id" class="cart-item-card">
          <img :src="item.image" alt="produto" style="width: 60px; height: 60px; object-fit: contain;">
          <div>
            <h3>{{ item.name }}</h3>
            <p>R$ {{ item.price.toFixed(2) }} x {{ item.quantity }}</p>
            <button @click="remove(item.id)" class="remove-btn">Remover</button>
          </div>
        </div>
      </div>
      <!-- Dados do cliente para retirada -->
      <div class="checkout-section">
        <h3>Dados para Retirada</h3>
        <input v-model="form.block" placeholder="Bloco (Ex: Bloco A)" required>
        <input v-model="form.apartment" placeholder="Apartamento (Ex: Apto 102)" required>
        <label>Horário sugerido para buscar:</label>
        <input v-model="form.pickupTime" type="time" required>
        <label>Forma de Pagamento:</label>
        <select v-model="form.paymentMethod">
          <option value="pix">PIX (Pagar agora)</option>
          <option value="credito">Cartão de Crédito (Na retirada)</option>
          <option value="debito">Cartão de Débito (Na retirada)</option>
          <option value="especie">Espécie / Dinheiro (Na retirada)</option>
        </select>
        <div style="font-size: 18px; margin: 15px 0; font-weight: bold;">Total: R$ {{ total.toFixed(2) }}</div>
        <button @click="finalize" class="submit-btn">Confirmar e Finalizar</button>
      </div>
    </div>
    <!-- Tela do PIX exibida após finalizar -->
    <div v-else class="pix-screen">
      <span style="font-size: 50px;">✅</span>
      <h2>Pedido Confirmado!</h2>
      <p>O seu pedido foi enviado para o painel da Mercearia Josy.</p>
      <div v-if="form.paymentMethod === 'pix'" class="pix-box">
        <h3>PAGAMENTO VIA PIX</h3>
        <p>Transfira o valor de <strong>R$ {{ totalFinal.toFixed(2) }}</strong> para o CNPJ abaixo:</p>
        <div class="pix-key">35708277000158</div>
        <button @click="copyPix" class="copy-btn">{{ copyText }}</button>
      </div>
      <p style="background: #fff3bf; padding: 10px; border-radius: 5px; font-weight: 500; color: #2b2d42;">
        🏠 Venha retirar no horário combinado: <strong>{{ form.pickupTime }} hs</strong>.
      </p>
      <button @click="$router.push('/')" style="background: #1d3557; color: white; margin-top: 15px;">Voltar à Página Inicial</button>
    </div>
  </div>
</template>

<script>
export default {
  data() { 
    return { 
      success: false, 
      totalFinal: 0, 
      copyText: 'Copiar Chave CNPJ', 
      form: { block: '', apartment: '', pickupTime: '', paymentMethod: 'pix' } 
    }; 
  },
  computed: { 
    cart() { return this.$store.state.cart; }, 
    total() { return this.cart.reduce((s, i) => s + (i.price * i.quantity), 0); } 
  },
  methods: {
    remove(id) { this.$store.commit('REMOVE_FROM_CART', id); },
    finalize() {
      if (!this.form.block || !this.form.apartment || !this.form.pickupTime) { 
        alert('Por favor, preencha o bloco, apartamento e o horário de retirada!'); 
        return; 
      }
      this.totalFinal = this.total;
      this.$store.commit('FINALIZAR_PEDIDO', { 
        items: [...this.cart], 
        total: this.total, 
        customer: { ...this.form } 
      });
      this.success = true;
    },
    copyPix() {
      navigator.clipboard.writeText('35708277000158'); 
      this.copyText = '✓ Chave Copiada!';
      setTimeout(() => this.copyText = 'Copiar Chave CNPJ', 2000);
    }
  }
};
</script>

<style scoped>
.cart-layout { display: flex; gap: 20px; flex-wrap: wrap; text-align: left; }
.items-section { flex: 2; display: flex; flex-direction: column; gap: 10px; }
.checkout-section { flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.cart-item-card { display: flex; background: white; padding: 10px; border-radius: 8px; gap: 15px; border: 1px solid #eee; align-items: center; text-align: left; }
.remove-btn { background: #ffe3e3; color: #c92a2a; font-size: 11px; padding: 4px 8px; margin-top: 5px; }
.submit-btn { background: #40c057; color: white; width: 100%; font-size: 16px; }
.pix-screen { text-align: center; background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.pix-box { background: #e7f5ff; border: 2px solid #339af0; padding: 15px; border-radius: 8px; margin: 15px 0; }
.pix-key { font-size: 18px; font-weight: bold; color: #1c7ed6; background: white; padding: 8px; border-radius: 4px; margin: 10px 0; border: 1px dashed #339af0; }
.copy-btn { background: #339af0; color: white; font-size: 12px; padding: 6px 12px; }
</style>
EOF
