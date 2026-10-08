<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ProductArt from '../components/ProductArt.vue'
import ProductRow from '../components/ProductRow.vue'
import ProductCard from '../components/ProductCard.vue'
import Icon from '../components/Icon.vue'
import { products, categories } from '../data/products.js'

const slides = [
  { eyebrow: 'Semana de la tecnología', title: 'Hasta 30% OFF\nen audio y wearables', cta: 'Ver ofertas', to: { name: 'search', query: { cat: 'tecnologia' } }, kinds: ['headphones', 'watch'], hue: 250, bg: 'linear-gradient(120deg,#1b2a7a 0%,#2f5bff 60%,#6d8bff 100%)' },
  { eyebrow: 'Nuevo en Hogar', title: 'Diseño que se\nsiente en casa', cta: 'Explorar Hogar', to: { name: 'search', query: { cat: 'hogar' } }, kinds: ['lamp', 'plant'], hue: 35, bg: 'linear-gradient(120deg,#3b2414 0%,#a45b26 55%,#e7a768 100%)' },
  { eyebrow: 'Entrená a tu ritmo', title: '12 cuotas sin interés\nen deportes', cta: 'Ver Deportes', to: { name: 'search', query: { cat: 'deportes' } }, kinds: ['bike', 'sneaker'], hue: 150, bg: 'linear-gradient(120deg,#08372a 0%,#0f7a57 55%,#3fcf98 100%)' },
]
const i = ref(0)
let timer
const next = (d = 1) => { i.value = (i.value + d + slides.length) % slides.length; restart() }
const restart = () => { clearInterval(timer); timer = setInterval(() => (i.value = (i.value + 1) % slides.length), 6000) }
onMounted(restart)
onBeforeUnmount(() => clearInterval(timer))

const deals = computed(() => products.filter((p) => p.deal))
const best = computed(() => [...products].sort((a, b) => b.sold - a.sold || b.reviews - a.reviews).slice(0, 10))
const recommended = computed(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 10))
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="container hero-wrap">
      <div class="hero">
        <TransitionGroup name="slide">
          <article v-for="(s, n) in slides" v-show="n === i" :key="n" class="slide" :style="{ background: s.bg }">
            <div class="copy">
              <span class="eyebrow">{{ s.eyebrow }}</span>
              <h1>{{ s.title }}</h1>
              <RouterLink :to="s.to" class="btn hero-btn">{{ s.cta }} <Icon name="chevronR" :size="18" /></RouterLink>
            </div>
            <div class="arts" aria-hidden="true">
              <div class="a1"><ProductArt :kind="s.kinds[0]" :hue="s.hue" :bg="false" /></div>
              <div class="a2"><ProductArt :kind="s.kinds[1]" :hue="(s.hue + 30) % 360" :bg="false" /></div>
            </div>
          </article>
        </TransitionGroup>
        <button class="nav prev" @click="next(-1)" aria-label="Anterior"><Icon name="chevronL" /></button>
        <button class="nav nxt" @click="next(1)" aria-label="Siguiente"><Icon name="chevronR" /></button>
        <div class="dots">
          <button v-for="(s, n) in slides" :key="n" :class="{ on: n === i }" @click="i = n; restart()" :aria-label="`Ir al banner ${n + 1}`" />
        </div>
      </div>
    </section>

    <!-- Categorías -->
    <section class="container block">
      <div class="cats">
        <RouterLink v-for="c in categories" :key="c.id" :to="{ name: 'search', query: { cat: c.id } }" class="cat card">
          <span class="ci"><ProductArt :kind="c.icon" :hue="products.find(p => p.category === c.id).hue" /></span>
          <span>{{ c.name }}</span>
        </RouterLink>
      </div>
    </section>

    <section class="container block">
      <ProductRow title="Ofertas del día" :products="deals" :link="{ name: 'search', query: { deals: 1 } }" />
    </section>

    <!-- Promos -->
    <section class="container block promos">
      <RouterLink :to="{ name: 'search', query: { ship: 1 } }" class="promo p1">
        <div>
          <span class="badge badge-ok">Envío gratis</span>
          <h3>Comprá desde $ 50.000 y el envío corre por nuestra cuenta</h3>
          <span class="link">Ver productos</span>
        </div>
        <span class="pi"><Icon name="truck" :size="56" /></span>
      </RouterLink>
      <RouterLink :to="{ name: 'search', query: { cat: 'gaming' } }" class="promo p2">
        <div>
          <span class="badge badge-soft">Gaming</span>
          <h3>Armá tu setup con hasta 12 cuotas sin interés</h3>
          <span class="link">Ver gaming</span>
        </div>
        <span class="pa"><ProductArt kind="controller" :hue="275" :bg="false" /></span>
      </RouterLink>
    </section>

    <section class="container block">
      <ProductRow title="Los más vendidos" :products="best" :link="{ name: 'search', query: { sort: 'sold' } }" />
    </section>

    <section class="container block">
      <div class="head"><h2 class="section-title">Recomendados para vos</h2></div>
      <div class="grid">
        <ProductCard v-for="p in recommended" :key="p.id" :product="p" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { padding-top: 20px; }
.block { margin-top: 40px; }
.head { margin-bottom: 16px; }

.hero { position: relative; height: clamp(260px, 32vw, 380px); border-radius: 22px; overflow: hidden; box-shadow: var(--shadow-lg); }
.slide { position: absolute; inset: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(24px, 6vw, 80px); color: #fff; overflow: hidden; }
.slide::after { content: ''; position: absolute; inset: 0; background: radial-gradient(60% 90% at 80% 50%, rgba(255,255,255,.18), transparent 60%); pointer-events: none; }
.copy { position: relative; z-index: 1; max-width: 520px; }
.eyebrow { display: inline-block; font-size: 13px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; opacity: .85; margin-bottom: 12px; }
.hero h1 { margin: 0 0 24px; font-size: clamp(28px, 4vw, 50px); line-height: 1.05; letter-spacing: -.04em; font-weight: 700; white-space: pre-line; }
.hero-btn { background: #fff; color: var(--ink); }
.hero-btn:hover { background: #f1f3f8; }
.arts { position: relative; width: 44%; height: 100%; z-index: 1; }
.a1 { position: absolute; width: 72%; right: 18%; top: 50%; transform: translateY(-50%); filter: drop-shadow(0 24px 30px rgba(0,0,0,.3)); }
.a2 { position: absolute; width: 44%; right: -2%; bottom: 4%; filter: drop-shadow(0 16px 20px rgba(0,0,0,.3)); }
.slide-enter-active, .slide-leave-active { transition: opacity .6s ease; }
.slide-enter-active .a1 { animation: floatIn .9s var(--ease) both; }
.slide-enter-active .copy { animation: textIn .7s var(--ease) both; }
@keyframes floatIn { from { opacity: 0; transform: translate(30px, -50%) scale(.95); } }
@keyframes textIn { from { opacity: 0; transform: translateY(14px); } }
.slide-enter-from, .slide-leave-to { opacity: 0; }

.nav { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; background: rgba(255,255,255,.18); color: #fff; backdrop-filter: blur(6px); opacity: 0; transition: opacity .2s, background .2s; }
.hero:hover .nav { opacity: 1; }
.nav:hover { background: rgba(255,255,255,.32); }
.prev { left: 16px; } .nxt { right: 16px; }
.dots { position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 2; }
.dots button { width: 8px; height: 8px; border-radius: 4px; background: rgba(255,255,255,.45); transition: width .3s var(--ease), background .3s; }
.dots button.on { width: 26px; background: #fff; }

.cats { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; }
.cat { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 18px 10px; font-size: 14px; font-weight: 500; text-align: center; transition: box-shadow .3s var(--ease), transform .3s var(--ease); }
.cat:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); color: var(--brand); }
.ci { width: 72px; height: 72px; border-radius: 50%; overflow: hidden; }

.promos { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.promo { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 28px 32px; border-radius: var(--r-lg); overflow: hidden; min-height: 170px; transition: transform .3s var(--ease), box-shadow .3s; }
.promo:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.promo h3 { margin: 12px 0 10px; font-size: 20px; letter-spacing: -.02em; line-height: 1.25; max-width: 340px; }
.p1 { background: linear-gradient(135deg, #e9f9f0, #d3f3e2); }
.p2 { background: linear-gradient(135deg, #f1edff, #e1d9ff); }
.pi { color: var(--ok); width: 110px; height: 110px; border-radius: 50%; background: rgba(255,255,255,.7); display: grid; place-items: center; flex: none; }
.pa { width: 150px; flex: none; margin: -20px -10px -20px 0; }

.grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }

@media (max-width: 1100px) { .grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 900px) {
  .cats { grid-template-columns: repeat(3, 1fr); }
  .promos { grid-template-columns: 1fr; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .hero { height: 300px; }
  .slide { flex-direction: column; justify-content: center; align-items: flex-start; padding-top: 28px; }
  .arts { position: absolute; right: -20px; bottom: -10px; width: 58%; height: 60%; opacity: .95; }
  .copy { max-width: 70%; }
  .hero h1 { font-size: 26px; }
  .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .cats { grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .ci { width: 56px; height: 56px; }
  .cat { font-size: 12.5px; padding: 14px 6px; }
  .promo { padding: 22px; }
  .pi { width: 80px; height: 80px; }
  .pa { width: 110px; }
}
</style>
