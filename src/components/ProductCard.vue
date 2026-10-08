<script setup>
import { computed } from 'vue'
import ProductArt from './ProductArt.vue'
import Stars from './Stars.vue'
import Icon from './Icon.vue'
import { money, discount } from '../data/products.js'
import { useShop } from '../stores/shop.js'

const props = defineProps({ product: Object, layout: { type: String, default: 'grid' } })
const shop = useShop()
const off = computed(() => discount(props.product))
const to = computed(() => ({ name: 'product', params: { id: props.product.id, slug: props.product.slug } }))
</script>

<template>
  <article class="pc" :class="`is-${layout}`">
    <RouterLink :to="to" class="media">
      <ProductArt :kind="product.kind" :hue="product.hue" />
      <span v-if="product.deal" class="badge badge-brand deal"><Icon name="bolt" :size="12" />Oferta del día</span>
    </RouterLink>
    <button class="fav" :class="{ on: shop.isFav(product.id) }" @click="shop.toggleFav(product.id)"
            :aria-label="shop.isFav(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'">
      <Icon name="heart" :size="18" />
    </button>

    <div class="info">
      <RouterLink :to="to" class="title">{{ product.title }}</RouterLink>
      <div v-if="product.oldPrice" class="old price">{{ money(product.oldPrice) }}</div>
      <div class="now">
        <span class="price">{{ money(product.price) }}</span>
        <span v-if="off" class="off">{{ off }}% OFF</span>
      </div>
      <div class="cuotas">Mismo precio en <b>{{ product.installments }} cuotas</b> de {{ money(product.price / product.installments) }}</div>
      <div v-if="product.freeShipping" class="ship ok"><b>Envío gratis</b></div>
      <Stars :value="product.rating" :count="product.reviews" />
    </div>
  </article>
</template>

<style scoped>
.pc {
  position: relative; display: flex; flex-direction: column;
  background: var(--surface); border-radius: var(--r-lg); overflow: hidden;
  box-shadow: var(--shadow); transition: box-shadow .3s var(--ease), transform .3s var(--ease);
}
.pc:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.media { position: relative; aspect-ratio: 1; border-bottom: 1px solid var(--line); overflow: hidden; }
.media :deep(svg) { transition: transform .5s var(--ease); }
.pc:hover .media :deep(svg) { transform: scale(1.04); }
.deal { position: absolute; left: 12px; top: 12px; }
.fav {
  position: absolute; right: 10px; top: 10px; width: 36px; height: 36px; border-radius: 50%;
  display: grid; place-items: center; background: rgba(255,255,255,.92); color: var(--brand);
  box-shadow: var(--shadow); opacity: 0; transform: scale(.9); transition: opacity .2s, transform .2s;
}
.pc:hover .fav, .fav.on, .fav:focus-visible { opacity: 1; transform: none; }
.fav.on :deep(svg) { fill: var(--brand); }
.info { padding: 14px 16px 18px; display: flex; flex-direction: column; gap: 3px; flex: 1; }
.title { font-size: 14px; color: var(--ink-2); line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.7em; margin-bottom: 6px; }
.title:hover { color: var(--brand); }
.old { font-size: 12px; color: var(--muted); text-decoration: line-through; }
.now { display: flex; align-items: baseline; flex-wrap: wrap; gap: 0 8px; }
.now .price { font-size: 22px; font-weight: 500; white-space: nowrap; }
.off { white-space: nowrap; }
.off { font-size: 13px; font-weight: 600; color: var(--ok); }
.cuotas { font-size: 12.5px; color: var(--ink-2); }
.cuotas b { color: var(--ok); font-weight: 600; }
.ship { font-size: 13px; margin: 2px 0 4px; }

/* layout lista */
.pc.is-list { flex-direction: row; }
.pc.is-list .media { width: 220px; flex: none; aspect-ratio: 1; border-bottom: 0; border-right: 1px solid var(--line); }
.pc.is-list .info { padding: 20px 24px; }
.pc.is-list .title { font-size: 16px; -webkit-line-clamp: 2; }
@media (max-width: 640px) {
  .now .price { font-size: 19px; }
  .info { padding: 12px 12px 14px; }
  .pc.is-list .media { width: 130px; }
  .pc.is-list .info { padding: 12px 14px; }
  .fav { opacity: 1; transform: none; }
}
</style>
