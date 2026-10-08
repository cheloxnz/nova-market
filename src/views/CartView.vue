<script setup>
import { computed } from 'vue'
import ProductArt from '../components/ProductArt.vue'
import QtyStepper from '../components/QtyStepper.vue'
import ProductRow from '../components/ProductRow.vue'
import Icon from '../components/Icon.vue'
import { useShop, FREE_SHIPPING_FROM } from '../stores/shop.js'
import { products, money } from '../data/products.js'

const shop = useShop()
const progress = computed(() => Math.min(100, (shop.subtotal / FREE_SHIPPING_FROM) * 100))
const missing = computed(() => Math.max(0, FREE_SHIPPING_FROM - shop.subtotal))
const suggestions = computed(() => products.filter((p) => !shop.cart.some((i) => i.id === p.id)).sort((a, b) => b.sold - a.sold).slice(0, 10))
</script>

<template>
  <div class="container cart-page">
    <h1 class="h1">Carrito <span class="muted" v-if="shop.count">({{ shop.count }})</span></h1>

    <div v-if="shop.items.length" class="layout">
      <section class="card list">
        <div class="ship-bar" :class="{ done: shop.shipping === 0 }">
          <Icon name="truck" :size="20" />
          <div class="sb-txt">
            <span v-if="shop.shipping === 0"><b>¡Tu envío es gratis!</b></span>
            <span v-else>Sumá <b>{{ money(missing) }}</b> para obtener <b class="ok">envío gratis</b></span>
            <span class="track"><i :style="{ width: (shop.shipping === 0 ? 100 : progress) + '%' }" /></span>
          </div>
        </div>

        <TransitionGroup name="row" tag="ul" class="rows">
          <li v-for="it in shop.items" :key="it.id" class="row">
            <RouterLink :to="{ name: 'product', params: { id: it.id, slug: it.product.slug } }" class="thumb"><ProductArt :kind="it.product.kind" :hue="it.product.hue" /></RouterLink>
            <div class="r-info">
              <RouterLink :to="{ name: 'product', params: { id: it.id, slug: it.product.slug } }" class="r-title">{{ it.product.title }}</RouterLink>
              <span v-if="it.product.freeShipping" class="ok small">Envío gratis</span>
              <div class="r-actions">
                <button class="link" @click="shop.remove(it.id)">Eliminar</button>
                <button class="link" @click="shop.toggleFav(it.id); shop.remove(it.id)">Guardar en favoritos</button>
              </div>
            </div>
            <div class="r-qty">
              <QtyStepper :model-value="it.qty" :max="it.product.stock" @update:model-value="(v) => shop.setQty(it.id, v)" />
              <span class="muted small">{{ it.product.stock }} disponibles</span>
            </div>
            <div class="r-price">
              <span v-if="it.product.oldPrice" class="old price">{{ money(it.product.oldPrice * it.qty) }}</span>
              <b class="price">{{ money(it.product.price * it.qty) }}</b>
            </div>
          </li>
        </TransitionGroup>
      </section>

      <aside class="card summary">
        <h2>Resumen de compra</h2>
        <div class="line"><span>Productos ({{ shop.count }})</span><span class="price">{{ money(shop.subtotal + shop.savings) }}</span></div>
        <div v-if="shop.savings" class="line ok"><span>Descuentos</span><span class="price">− {{ money(shop.savings) }}</span></div>
        <div class="line"><span>Envío</span><span :class="{ ok: shop.shipping === 0 }" class="price">{{ shop.shipping === 0 ? 'Gratis' : money(shop.shipping) }}</span></div>
        <div class="line total"><span>Total</span><span class="price">{{ money(shop.total) }}</span></div>
        <RouterLink to="/checkout" class="btn btn-primary btn-block">Continuar compra</RouterLink>
        <p class="secure muted"><Icon name="lock" :size="14" />Compra protegida de punta a punta</p>
      </aside>
    </div>

    <div v-else class="card empty">
      <span class="e-ico"><Icon name="cart" :size="36" /></span>
      <h2>Tu carrito está vacío</h2>
      <p class="muted">Sumá productos y conseguí envío gratis en compras desde {{ money(FREE_SHIPPING_FROM) }}.</p>
      <RouterLink to="/search" class="btn btn-primary">Descubrir productos</RouterLink>
    </div>

    <section class="block">
      <ProductRow title="También te puede interesar" :products="suggestions" />
    </section>
  </div>
</template>

<style scoped>
.cart-page { padding-top: 24px; }
.h1 { font-size: 28px; letter-spacing: -.03em; margin: 0 0 18px; }
.layout { display: grid; grid-template-columns: 1fr 360px; gap: 16px; align-items: start; }
.list { overflow: hidden; }
.ship-bar { display: flex; gap: 14px; align-items: center; padding: 18px 24px; border-bottom: 1px solid var(--line); font-size: 14px; color: var(--ok); }
.sb-txt { flex: 1; display: flex; flex-direction: column; gap: 8px; color: var(--ink); }
.track { height: 6px; background: var(--line); border-radius: 3px; overflow: hidden; }
.track i { display: block; height: 100%; background: var(--ok); border-radius: 3px; transition: width .6s var(--ease); }
.rows { list-style: none; margin: 0; padding: 0; }
.row { display: grid; grid-template-columns: 88px 1fr auto 140px; gap: 20px; align-items: center; padding: 22px 24px; border-bottom: 1px solid var(--line); }
.row:last-child { border-bottom: 0; }
.thumb { width: 88px; height: 88px; border-radius: 12px; overflow: hidden; }
.r-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.r-title { font-weight: 500; line-height: 1.35; }
.r-title:hover { color: var(--brand); }
.r-actions { display: flex; gap: 16px; font-size: 13px; margin-top: 4px; }
.r-qty { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.r-price { display: flex; flex-direction: column; align-items: flex-end; }
.r-price b { font-size: 20px; font-weight: 500; }
.old { font-size: 12px; color: var(--muted); text-decoration: line-through; }
.small { font-size: 12.5px; }

.summary { padding: 24px; position: sticky; top: 140px; display: flex; flex-direction: column; gap: 12px; }
.summary h2 { font-size: 18px; margin: 0 0 6px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }
.line { display: flex; justify-content: space-between; font-size: 15px; }
.total { font-size: 20px; font-weight: 650; padding-top: 12px; margin-top: 4px; border-top: 1px solid var(--line); margin-bottom: 8px; }
.secure { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12.5px; margin: 0; }

.empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 56px 24px; gap: 6px; }
.e-ico { width: 80px; height: 80px; border-radius: 50%; background: var(--brand-50); color: var(--brand); display: grid; place-items: center; margin-bottom: 8px; }
.empty h2 { margin: 0; }
.empty .btn { margin-top: 14px; }
.block { margin-top: 40px; }

.row-leave-active { transition: opacity .25s, transform .3s var(--ease); }
.row-leave-to { opacity: 0; transform: translateX(-16px); }
.row-move { transition: transform .3s var(--ease); }

@media (max-width: 960px) {
  .layout { grid-template-columns: 1fr; }
  .summary { position: static; }
}
@media (max-width: 640px) {
  .row { grid-template-columns: 72px 1fr; gap: 12px 14px; padding: 16px; }
  .thumb { width: 72px; height: 72px; }
  .r-qty { grid-column: 2; flex-direction: row; }
  .r-price { grid-column: 2; align-items: flex-start; }
  .ship-bar { padding: 14px 16px; }
}
</style>
