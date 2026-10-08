<script setup>
import Icon from './Icon.vue'
const benefits = [
  { icon: 'card', t: 'Pagá en cuotas', d: 'Hasta 12 cuotas sin interés con tarjetas seleccionadas.' },
  { icon: 'truck', t: 'Envío gratis', d: 'En miles de productos o en compras desde $ 50.000.' },
  { icon: 'shield', t: 'Compra protegida', d: 'Si no recibís lo que compraste, te devolvemos el dinero.' },
  { icon: 'return', t: 'Devolución gratis', d: 'Tenés 30 días desde que lo recibís.' },
]
</script>

<template>
  <footer class="ft">
    <div class="container benefits">
      <div v-for="b in benefits" :key="b.t" class="b">
        <span class="bi"><Icon :name="b.icon" :size="22" /></span>
        <div><b>{{ b.t }}</b><p>{{ b.d }}</p></div>
      </div>
    </div>
    <div class="bottom">
      <div class="container row">
        <span class="brand"><b>nova</b>market · Template de e-commerce</span>
        <span class="muted">Proyecto demo · Productos y marcas ficticios · Sin pagos reales</span>
        <a class="by" href="https://cheloxnz.github.io/" target="_blank" rel="noopener">Hecho por <b>Marcelo Del Valle</b></a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.ft { background: #fff; border-top: 1px solid var(--line); }
.benefits { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding-top: 40px; padding-bottom: 40px; }
.b { display: flex; gap: 14px; }
.bi { width: 44px; height: 44px; border-radius: 12px; background: var(--brand-50); color: var(--brand); display: grid; place-items: center; flex: none; }
.b b { font-size: 15px; }
.b p { margin: 2px 0 0; font-size: 13px; color: var(--muted); }
.bottom { border-top: 1px solid var(--line); background: var(--surface-2); font-size: 13px; }
.row { display: flex; gap: 8px 24px; flex-wrap: wrap; align-items: center; padding-top: 18px; padding-bottom: 18px; }
.brand b { font-weight: 700; }
.by { margin-left: auto; color: var(--ink-2); }
.by:hover b { color: var(--brand); }
@media (max-width: 900px) { .benefits { grid-template-columns: 1fr 1fr; } }
@media (max-width: 520px) { .benefits { grid-template-columns: 1fr; } .by { margin-left: 0; } }
</style>
