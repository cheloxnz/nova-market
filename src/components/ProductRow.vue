<script setup>
import { ref } from 'vue'
import ProductCard from './ProductCard.vue'
import Icon from './Icon.vue'
defineProps({ title: String, products: Array, link: Object })
const track = ref(null)
const scroll = (d) => track.value.scrollBy({ left: d * track.value.clientWidth * 0.8, behavior: 'smooth' })
</script>

<template>
  <section class="row-sec">
    <div class="head">
      <h2 class="section-title">{{ title }}</h2>
      <RouterLink v-if="link" :to="link" class="link">Ver todo</RouterLink>
      <div class="arrows">
        <button @click="scroll(-1)" aria-label="Anterior"><Icon name="chevronL" :size="18" /></button>
        <button @click="scroll(1)" aria-label="Siguiente"><Icon name="chevronR" :size="18" /></button>
      </div>
    </div>
    <div ref="track" class="track">
      <ProductCard v-for="p in products" :key="p.id" :product="p" class="item" />
    </div>
  </section>
</template>

<style scoped>
.head { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.arrows { margin-left: auto; display: flex; gap: 8px; }
.arrows button { width: 38px; height: 38px; border-radius: 50%; background: #fff; box-shadow: var(--shadow); display: grid; place-items: center; transition: box-shadow .2s; }
.arrows button:hover { box-shadow: var(--shadow-lg); }
.track { display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 4 * 16px) / 5); gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding: 4px 4px 12px; margin: -4px -4px 0; }
.track::-webkit-scrollbar { display: none; }
.item { scroll-snap-align: start; }
@media (max-width: 1100px) { .track { grid-auto-columns: calc((100% - 3 * 16px) / 4); } }
@media (max-width: 820px) { .track { grid-auto-columns: calc((100% - 2 * 16px) / 3); } }
@media (max-width: 560px) { .track { grid-auto-columns: 62%; } .arrows { display: none; } }
</style>
