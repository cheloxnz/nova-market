<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductArt from '../components/ProductArt.vue'
import ProductRow from '../components/ProductRow.vue'
import Stars from '../components/Stars.vue'
import Icon from '../components/Icon.vue'
import QtyStepper from '../components/QtyStepper.vue'
import { products, categories, getProduct, money, discount, descriptions } from '../data/products.js'
import { useShop } from '../stores/shop.js'

const route = useRoute()
const router = useRouter()
const shop = useShop()

const p = computed(() => getProduct(route.params.id))
const cat = computed(() => categories.find((c) => c.id === p.value?.category))
const off = computed(() => (p.value ? discount(p.value) : 0))
const related = computed(() => products.filter((x) => x.category === p.value?.category && x.id !== p.value?.id).concat(products.filter((x) => x.category !== p.value?.category)).slice(0, 10))

const color = ref(0)
const view = ref(0)
const qty = ref(1)
watch(() => route.params.id, () => { color.value = 0; view.value = 0; qty.value = 1; questions.value = [] })

const hue = computed(() => p.value.colors[color.value])
const views = [
  { scale: 1, rot: 0 },
  { scale: 1.35, rot: -8 },
  { scale: .85, rot: 10 },
  { scale: 1.8, rot: 0 },
]
const colorNames = ['Original', 'Alternativo', 'Grafito']

const arrival = computed(() => {
  const d = new Date(); d.setDate(d.getDate() + (p.value.freeShipping ? 1 : 3))
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
})

const buyNow = () => { shop.add(p.value.id, qty.value); shop.toast = null; router.push('/checkout') }
const addToCart = () => shop.add(p.value.id, qty.value)

// Zoom con el mouse
const zoom = ref({ on: false, x: 50, y: 50 })
const onMove = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  zoom.value = { on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }
}

const dist = computed(() => {
  const r = p.value.rating
  const five = Math.round((r - 3.6) * 55)
  const four = Math.round((100 - five) * 0.62)
  const three = Math.round((100 - five - four) * 0.6)
  const two = Math.round((100 - five - four - three) * 0.6)
  return [five, four, three, two, Math.max(0, 100 - five - four - three - two)]
})

const question = ref('')
const questions = ref([])
const ask = () => {
  if (!question.value.trim()) return
  questions.value.unshift({ q: question.value.trim(), a: null })
  question.value = ''
}
</script>

<template>
  <div v-if="p" class="container pdp">
    <nav class="crumbs">
      <RouterLink to="/">Inicio</RouterLink><Icon name="chevronR" :size="14" />
      <RouterLink :to="{ name: 'search', query: { cat: p.category } }">{{ cat.name }}</RouterLink><Icon name="chevronR" :size="14" />
      <span>{{ p.brand }}</span>
    </nav>

    <div class="top card">
      <!-- Galería -->
      <div class="gallery">
        <div class="thumbs">
          <button v-for="(v, i) in views" :key="i" :class="{ on: view === i }" @mouseenter="view = i" @click="view = i" :aria-label="`Imagen ${i + 1}`">
            <span class="tv" :style="{ transform: `scale(${v.scale}) rotate(${v.rot}deg)` }"><ProductArt :kind="p.kind" :hue="hue" :bg="false" /></span>
          </button>
        </div>
        <div class="stage" @mousemove="onMove" @mouseleave="zoom.on = false" :style="{ background: `hsl(${hue} 60% 97%)` }">
          <div class="stage-in" :style="{ transform: `scale(${views[view].scale * (zoom.on ? 1.7 : 1)}) rotate(${views[view].rot}deg)`, transformOrigin: `${zoom.x}% ${zoom.y}%` }">
            <ProductArt :kind="p.kind" :hue="hue" :bg="false" />
          </div>
          <button class="fav" :class="{ on: shop.isFav(p.id) }" @click="shop.toggleFav(p.id)" :aria-label="shop.isFav(p.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"><Icon name="heart" /></button>
        </div>
      </div>

      <!-- Info -->
      <div class="info">
        <div class="meta muted">Nuevo · +{{ p.sold.toLocaleString('es-AR') }} vendidos</div>
        <span v-if="p.deal" class="badge badge-brand deal"><Icon name="bolt" :size="12" />Oferta del día</span>
        <h1 class="title">{{ p.title }}</h1>
        <a href="#reviews" class="rating"><b>{{ p.rating.toFixed(1) }}</b><Stars :value="p.rating" :count="p.reviews" :size="15" /></a>

        <div class="pricebox">
          <div v-if="p.oldPrice" class="old price">{{ money(p.oldPrice) }}</div>
          <div class="now"><span class="price">{{ money(p.price) }}</span><span v-if="off" class="off">{{ off }}% OFF</span></div>
          <div class="cuotas">Mismo precio en <b class="ok">{{ p.installments }} cuotas de {{ money(p.price / p.installments) }}</b></div>
          <a href="#" class="link small" @click.prevent>Ver los medios de pago</a>
        </div>

        <div class="opt">
          <div class="opt-l">Color: <b>{{ colorNames[color] }}</b></div>
          <div class="swatches">
            <button v-for="(c, i) in p.colors" :key="i" :class="{ on: color === i }" :style="{ '--c': `hsl(${c} 65% 55%)` }" @click="color = i" :aria-label="colorNames[i]" />
          </div>
        </div>
      </div>

      <!-- Compra -->
      <aside class="buy">
        <div class="ship">
          <Icon name="truck" :size="20" :class="p.freeShipping ? 'ok' : ''" />
          <div>
            <b :class="{ ok: p.freeShipping }">{{ p.freeShipping ? 'Llega gratis' : 'Llega' }} el {{ arrival }}</b>
            <p v-if="!p.freeShipping" class="muted">Envío {{ money(6999) }} · gratis desde $ 50.000</p>
            <p class="muted">Enviar a {{ shop.zip }}</p>
          </div>
        </div>
        <div class="ship">
          <Icon name="return" :size="20" />
          <div><b>Devolución gratis</b><p class="muted">Tenés 30 días desde que lo recibís.</p></div>
        </div>

        <div class="stock"><b>Stock disponible</b><span class="muted">({{ p.stock }} disponibles)</span></div>
        <div class="qty-row"><span>Cantidad:</span><QtyStepper v-model="qty" :max="p.stock" /></div>

        <button class="btn btn-primary btn-block" @click="buyNow">Comprar ahora</button>
        <button class="btn btn-soft btn-block" @click="addToCart">Agregar al carrito</button>

        <ul class="trust">
          <li><Icon name="shield" :size="18" /><span><b>Compra protegida</b>, recibí el producto que esperabas o te devolvemos tu dinero.</span></li>
          <li><Icon name="store" :size="18" /><span>Vendido por <b class="link">{{ p.brand }} Store</b> · Tienda oficial</span></li>
        </ul>
      </aside>
    </div>

    <div class="details">
      <section class="card sec">
        <h2 class="section-title">Características principales</h2>
        <table class="specs">
          <tbody>
            <tr><th>Marca</th><td>{{ p.brand }}</td></tr>
            <tr v-for="(v, k) in p.specs" :key="k"><th>{{ k }}</th><td>{{ v }}</td></tr>
          </tbody>
        </table>
        <h2 class="section-title mt">Descripción</h2>
        <p class="desc">{{ descriptions[p.id] || descriptions.default }}</p>
      </section>

      <div class="side">
        <section id="reviews" class="card sec">
          <h2 class="section-title">Opiniones del producto</h2>
          <div class="rv">
            <div class="big"><b>{{ p.rating.toFixed(1) }}</b><Stars :value="p.rating" :size="18" /><span class="muted">{{ p.reviews.toLocaleString('es-AR') }} calificaciones</span></div>
            <ul class="bars">
              <li v-for="(v, i) in dist" :key="i"><span>{{ 5 - i }}★</span><span class="bar"><i :style="{ width: v + '%' }" /></span></li>
            </ul>
          </div>
        </section>

        <section class="card sec">
          <h2 class="section-title">Preguntas</h2>
          <form class="ask" @submit.prevent="ask">
            <input v-model="question" class="input" placeholder="Escribí tu pregunta…" maxlength="200" />
            <button class="btn btn-primary">Preguntar</button>
          </form>
          <ul v-if="questions.length" class="qs">
            <li v-for="(x, i) in questions" :key="i"><p>{{ x.q }}</p><span class="muted">Pendiente de respuesta · demo</span></li>
          </ul>
          <p v-else class="muted small">Todavía no hay preguntas. ¡Hacé la primera!</p>
        </section>
      </div>
    </div>

    <section class="block">
      <ProductRow title="Productos relacionados" :products="related" />
    </section>
  </div>

  <div v-else class="container nf card">
    <h1>Producto no encontrado</h1>
    <RouterLink to="/" class="btn btn-primary">Volver al inicio</RouterLink>
  </div>
</template>

<style scoped>
.pdp { padding-top: 18px; }
.crumbs { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); margin-bottom: 14px; }
.crumbs a { color: var(--brand); }

.top { display: grid; grid-template-columns: 1.25fr 1fr 340px; gap: 32px; padding: 28px; }

.gallery { display: grid; grid-template-columns: 64px 1fr; gap: 14px; align-self: start; position: sticky; top: 140px; }
.thumbs { display: flex; flex-direction: column; gap: 8px; }
.thumbs button { width: 64px; height: 64px; border-radius: 10px; border: 1px solid var(--line-2); overflow: hidden; background: var(--surface-2); padding: 6px; transition: border-color .2s; }
.thumbs button.on { border: 2px solid var(--brand); padding: 5px; }
.tv { display: block; width: 100%; height: 100%; }
.stage { position: relative; aspect-ratio: 1; border-radius: 16px; overflow: hidden; cursor: zoom-in; display: grid; place-items: center; transition: background .4s; }
.stage-in { width: 82%; transition: transform .35s var(--ease); }
.fav { position: absolute; right: 14px; top: 14px; width: 42px; height: 42px; border-radius: 50%; background: #fff; color: var(--brand); display: grid; place-items: center; box-shadow: var(--shadow); }
.fav.on :deep(svg) { fill: var(--brand); }

.info { display: flex; flex-direction: column; gap: 6px; }
.meta { font-size: 13px; }
.deal { align-self: flex-start; }
.title { margin: 2px 0 4px; font-size: 24px; line-height: 1.25; letter-spacing: -.025em; font-weight: 650; }
.rating { display: flex; align-items: center; gap: 8px; font-size: 14px; }
.pricebox { margin: 14px 0 6px; display: flex; flex-direction: column; gap: 2px; }
.old { color: var(--muted); text-decoration: line-through; font-size: 15px; }
.now { display: flex; align-items: baseline; gap: 10px; }
.now .price { font-size: 38px; font-weight: 400; letter-spacing: -.03em; }
.off { color: var(--ok); font-weight: 600; font-size: 17px; }
.cuotas { font-size: 15px; }
.small { font-size: 13px; }
.opt { margin-top: 18px; }
.opt-l { font-size: 14px; margin-bottom: 8px; }
.swatches { display: flex; gap: 10px; }
.swatches button { width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--line-2); background: linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 70%, #000)); position: relative; }
.swatches button.on { outline: 2px solid var(--brand); outline-offset: 2px; }

.buy { border: 1px solid var(--line); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 14px; align-self: start; }
.ship { display: flex; gap: 12px; font-size: 14px; }
.ship p { margin: 2px 0 0; font-size: 13px; }
.ship b::first-letter { text-transform: uppercase; }
.stock { font-size: 14px; display: flex; gap: 6px; margin-top: 4px; }
.qty-row { display: flex; align-items: center; gap: 12px; font-size: 14px; }
.trust { list-style: none; margin: 6px 0 0; padding: 14px 0 0; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 12px; font-size: 13px; color: var(--muted); }
.trust li { display: flex; gap: 10px; }
.trust svg { flex: none; color: var(--ink-2); }
.trust b { color: var(--ink-2); }

.details { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-top: 16px; align-items: start; }
.side { display: flex; flex-direction: column; gap: 16px; }
.sec { padding: 28px; }
.mt { margin-top: 32px; }
.specs { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; border-radius: 10px; overflow: hidden; }
.specs tr:nth-child(odd) { background: var(--surface-2); }
.specs th { text-align: left; font-weight: 600; width: 40%; padding: 12px 16px; }
.specs td { padding: 12px 16px; color: var(--ink-2); }
.desc { color: var(--ink-2); font-size: 15px; line-height: 1.7; margin: 12px 0 0; }

.rv { display: flex; gap: 28px; margin-top: 16px; align-items: center; }
.big { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
.big b { font-size: 48px; line-height: 1; font-weight: 500; letter-spacing: -.04em; color: var(--brand); }
.bars { list-style: none; padding: 0; margin: 0; flex: 1; display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--muted); }
.bars li { display: flex; align-items: center; gap: 8px; }
.bar { flex: 1; height: 6px; border-radius: 3px; background: var(--line); overflow: hidden; }
.bar i { display: block; height: 100%; background: var(--muted); border-radius: 3px; }
.ask { display: flex; gap: 8px; margin: 16px 0 12px; }
.ask .btn { height: 46px; flex: none; }
.qs { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
.qs p { margin: 0; }
.qs span { font-size: 12px; }

.block { margin-top: 40px; }
.nf { margin-top: 40px; padding: 48px; text-align: center; }

@media (max-width: 1100px) {
  .top { grid-template-columns: 1fr 1fr; }
  .buy { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; }
  .buy .btn, .trust { grid-column: span 1; }
}
@media (max-width: 820px) {
  .top { grid-template-columns: 1fr; padding: 16px; gap: 20px; }
  .gallery { position: static; grid-template-columns: 1fr; }
  .thumbs { flex-direction: row; order: 2; justify-content: center; }
  .thumbs button { width: 54px; height: 54px; }
  .buy { display: flex; padding: 16px; }
  .details { grid-template-columns: 1fr; }
  .sec { padding: 20px; }
  .title { font-size: 20px; }
  .now .price { font-size: 32px; }
}
</style>
