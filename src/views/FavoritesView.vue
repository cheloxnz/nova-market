<script setup>
import { computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import Icon from '../components/Icon.vue'
import { useShop } from '../stores/shop.js'
import { getProduct } from '../data/products.js'
const shop = useShop()
const list = computed(() => shop.favorites.map(getProduct).filter(Boolean))
</script>

<template>
  <div class="container fav">
    <h1 class="h1">Favoritos <span class="muted" v-if="list.length">({{ list.length }})</span></h1>
    <div v-if="list.length" class="grid"><ProductCard v-for="p in list" :key="p.id" :product="p" /></div>
    <div v-else class="card empty">
      <span class="e-ico"><Icon name="heart" :size="34" /></span>
      <h2>Todavía no tenés favoritos</h2>
      <p class="muted">Tocá el corazón en cualquier producto para guardarlo acá.</p>
      <RouterLink to="/search" class="btn btn-primary">Explorar productos</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.fav { padding-top: 24px; }
.h1 { font-size: 28px; letter-spacing: -.03em; margin: 0 0 18px; }
.grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
.empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 56px 24px; gap: 6px; }
.e-ico { width: 80px; height: 80px; border-radius: 50%; background: var(--brand-50); color: var(--brand); display: grid; place-items: center; margin-bottom: 8px; }
.empty h2 { margin: 0; }
.empty .btn { margin-top: 14px; }
@media (max-width: 1100px) { .grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 860px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
</style>
