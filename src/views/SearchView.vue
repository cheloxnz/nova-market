<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import Icon from '../components/Icon.vue'
import { products, categories, money } from '../data/products.js'

const route = useRoute()
const router = useRouter()
const PER_PAGE = 12

const query = computed(() => route.query)
const set = (patch) => {
  const next = { ...route.query, ...patch }
  Object.keys(next).forEach((k) => (next[k] === undefined || next[k] === '' || next[k] === null) && delete next[k])
  if (!('page' in patch)) delete next.page
  router.replace({ name: 'search', query: next })
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const base = computed(() => {
  const q = norm(query.value.q || '')
  return products.filter((p) => !q || q.split(/\s+/).every((w) => norm(p.title + ' ' + p.brand + ' ' + p.category).includes(w)))
})

const filtered = computed(() => {
  const { cat, deals, ship, min, max, rating, brand } = query.value
  return base.value.filter((p) =>
    (!cat || p.category === cat) &&
    (!deals || p.oldPrice) &&
    (!ship || p.freeShipping) &&
    (!brand || p.brand === brand) &&
    (!min || p.price >= Number(min)) &&
    (!max || p.price <= Number(max)) &&
    (!rating || p.rating >= Number(rating)))
})

const sorted = computed(() => {
  const arr = [...filtered.value]
  const s = query.value.sort
  if (s === 'price-asc') arr.sort((a, b) => a.price - b.price)
  else if (s === 'price-desc') arr.sort((a, b) => b.price - a.price)
  else if (s === 'sold') arr.sort((a, b) => b.sold - a.sold)
  else if (s === 'rating') arr.sort((a, b) => b.rating - a.rating)
  return arr
})

const page = computed(() => Math.max(1, Number(query.value.page) || 1))
const pages = computed(() => Math.max(1, Math.ceil(sorted.value.length / PER_PAGE)))
const visible = computed(() => sorted.value.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE))

// Facets (conteos sobre la búsqueda base)
const catCounts = computed(() => categories.map((c) => ({ ...c, n: base.value.filter((p) => p.category === c.id).length })).filter((c) => c.n))
const brands = computed(() => {
  const m = {}
  base.value.filter((p) => !query.value.cat || p.category === query.value.cat).forEach((p) => (m[p.brand] = (m[p.brand] || 0) + 1))
  return Object.entries(m).sort((a, b) => b[1] - a[1])
})
const ranges = [
  { label: 'Hasta $ 50.000', max: 50000 },
  { label: '$ 50.000 a $ 200.000', min: 50000, max: 200000 },
  { label: 'Más de $ 200.000', min: 200000 },
]

const minIn = ref(''); const maxIn = ref('')
watch(query, (q) => { minIn.value = q.min || ''; maxIn.value = q.max || '' }, { immediate: true })
const applyPrice = () => set({ min: minIn.value || undefined, max: maxIn.value || undefined })

const title = computed(() => {
  if (query.value.q) return query.value.q
  if (query.value.cat) return categories.find((c) => c.id === query.value.cat)?.name
  if (query.value.deals) return 'Ofertas'
  return 'Todos los productos'
})

const chips = computed(() => {
  const q = query.value, out = []
  if (q.cat) out.push({ k: 'cat', label: categories.find((c) => c.id === q.cat)?.name })
  if (q.brand) out.push({ k: 'brand', label: q.brand })
  if (q.deals) out.push({ k: 'deals', label: 'En oferta' })
  if (q.ship) out.push({ k: 'ship', label: 'Envío gratis' })
  if (q.rating) out.push({ k: 'rating', label: `${q.rating}★ o más` })
  if (q.min || q.max) out.push({ k: 'price', label: `${q.min ? money(q.min) : '$ 0'} – ${q.max ? money(q.max) : 'más'}` })
  return out
})
const removeChip = (k) => set(k === 'price' ? { min: undefined, max: undefined } : { [k]: undefined })
const clearAll = () => router.replace({ name: 'search', query: query.value.q ? { q: query.value.q } : {} })

const layout = ref('grid')
const showFilters = ref(false)
watch(() => route.fullPath, () => (showFilters.value = false))
</script>

<template>
  <div class="container srp">
    <nav class="crumbs">
      <RouterLink to="/">Inicio</RouterLink><Icon name="chevronR" :size="14" />
      <span>{{ query.q ? 'Búsqueda' : 'Catálogo' }}</span>
    </nav>

    <div class="layout">
      <!-- Filtros -->
      <aside class="filters" :class="{ open: showFilters }">
        <div class="f-head">
          <h1 class="f-title">{{ title }}</h1>
          <p class="muted">{{ filtered.length }} resultado{{ filtered.length === 1 ? '' : 's' }}</p>
          <button class="close only-m" @click="showFilters = false" aria-label="Cerrar filtros"><Icon name="close" /></button>
        </div>

        <div v-if="chips.length" class="chips">
          <button v-for="c in chips" :key="c.k" class="chip" @click="removeChip(c.k)">{{ c.label }}<Icon name="close" :size="12" /></button>
          <button class="link clear" @click="clearAll">Limpiar</button>
        </div>

        <div class="toggle-row">
          <label class="sw"><input type="checkbox" :checked="!!query.ship" @change="set({ ship: $event.target.checked ? 1 : undefined })" /><span /> <b class="ok">Envío gratis</b></label>
          <label class="sw"><input type="checkbox" :checked="!!query.deals" @change="set({ deals: $event.target.checked ? 1 : undefined })" /><span /> En oferta</label>
        </div>

        <section v-if="!query.cat && catCounts.length" class="f-sec">
          <h3>Categorías</h3>
          <button v-for="c in catCounts" :key="c.id" class="f-opt" @click="set({ cat: c.id })">{{ c.name }} <span>({{ c.n }})</span></button>
        </section>

        <section v-if="!query.brand && brands.length > 1" class="f-sec">
          <h3>Marca</h3>
          <button v-for="[b, n] in brands" :key="b" class="f-opt" @click="set({ brand: b })">{{ b }} <span>({{ n }})</span></button>
        </section>

        <section class="f-sec">
          <h3>Precio</h3>
          <button v-for="r in ranges" :key="r.label" class="f-opt" @click="set({ min: r.min, max: r.max })">{{ r.label }}</button>
          <form class="price-in" @submit.prevent="applyPrice">
            <input v-model="minIn" class="input" type="number" inputmode="numeric" placeholder="Mínimo" min="0" />
            <span>–</span>
            <input v-model="maxIn" class="input" type="number" inputmode="numeric" placeholder="Máximo" min="0" />
            <button class="go" aria-label="Aplicar precio"><Icon name="chevronR" :size="18" /></button>
          </form>
        </section>

        <section class="f-sec">
          <h3>Calificación</h3>
          <button v-for="r in [4.5, 4]" :key="r" class="f-opt" @click="set({ rating: r })"><span class="st">★</span> {{ r }} o más</button>
        </section>
      </aside>
      <div v-if="showFilters" class="scrim only-m" @click="showFilters = false" />

      <!-- Resultados -->
      <section class="results">
        <div class="toolbar">
          <button class="btn btn-ghost f-btn only-m" @click="showFilters = true"><Icon name="filter" :size="18" />Filtrar<span v-if="chips.length" class="n">{{ chips.length }}</span></button>
          <span class="count hide-m">{{ filtered.length }} resultados</span>
          <label class="sort">
            <span class="hide-m">Ordenar por</span>
            <select :value="query.sort || ''" @change="set({ sort: $event.target.value || undefined })">
              <option value="">Más relevantes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="sold">Más vendidos</option>
              <option value="rating">Mejor calificados</option>
            </select>
            <Icon name="chevronD" :size="16" class="sel-i" />
          </label>
          <div class="views hide-m">
            <button :class="{ on: layout === 'grid' }" @click="layout = 'grid'" aria-label="Vista grilla"><Icon name="grid" :size="18" /></button>
            <button :class="{ on: layout === 'list' }" @click="layout = 'list'" aria-label="Vista lista"><Icon name="list" :size="18" /></button>
          </div>
        </div>

        <div v-if="visible.length" :class="layout === 'grid' ? 'grid' : 'list'">
          <ProductCard v-for="p in visible" :key="p.id" :product="p" :layout="layout" />
        </div>

        <div v-else class="empty card">
          <Icon name="search" :size="40" />
          <h2>No encontramos resultados</h2>
          <p class="muted">Revisá la ortografía, usá palabras más generales o quitá algunos filtros.</p>
          <button class="btn btn-primary" @click="clearAll">Quitar filtros</button>
        </div>

        <nav v-if="pages > 1" class="pager">
          <button :disabled="page === 1" @click="set({ page: page - 1 })"><Icon name="chevronL" :size="16" />Anterior</button>
          <button v-for="n in pages" :key="n" :class="{ on: n === page }" class="num" @click="set({ page: n })">{{ n }}</button>
          <button :disabled="page === pages" @click="set({ page: page + 1 })">Siguiente<Icon name="chevronR" :size="16" /></button>
        </nav>
      </section>
    </div>
  </div>
</template>

<style scoped>
.srp { padding-top: 18px; }
.crumbs { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); margin-bottom: 18px; }
.crumbs a:hover { color: var(--brand); }
.layout { display: grid; grid-template-columns: 260px 1fr; gap: 28px; align-items: start; }

.filters { position: sticky; top: 140px; }
.f-head { position: relative; margin-bottom: 16px; }
.f-title { margin: 0; font-size: 26px; letter-spacing: -.03em; line-height: 1.15; text-transform: capitalize; }
.f-head p { margin: 4px 0 0; font-size: 14px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; align-items: center; }
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 8px; background: #fff; border: 1px solid var(--line-2); font-size: 13px; }
.chip:hover { border-color: var(--danger); color: var(--danger); }
.clear { font-size: 13px; margin-left: 4px; }

.toggle-row { display: flex; flex-direction: column; gap: 10px; background: #fff; border-radius: var(--r); padding: 14px; box-shadow: var(--shadow); margin-bottom: 20px; }
.sw { display: flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer; }
.sw input { position: absolute; opacity: 0; pointer-events: none; }
.sw span { width: 34px; height: 20px; border-radius: 10px; background: var(--line-2); position: relative; transition: background .2s; flex: none; }
.sw span::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.2); transition: transform .25s var(--ease); }
.sw input:checked + span { background: var(--brand); }
.sw input:checked + span::after { transform: translateX(14px); }
.sw input:focus-visible + span { outline: 2px solid var(--brand); outline-offset: 2px; }

.f-sec { margin-bottom: 22px; }
.f-sec h3 { font-size: 15px; margin: 0 0 8px; }
.f-opt { display: block; width: 100%; text-align: left; padding: 5px 0; font-size: 14px; color: var(--ink-2); }
.f-opt:hover { color: var(--brand); }
.f-opt span { color: var(--muted); }
.f-opt .st { color: var(--warn); }
.price-in { display: flex; align-items: center; gap: 6px; margin-top: 8px; }
.price-in .input { height: 38px; padding: 0 10px; font-size: 13px; }
.price-in .go { width: 38px; height: 38px; flex: none; border-radius: 10px; background: var(--brand); color: #fff; display: grid; place-items: center; }

.toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.count { font-size: 14px; color: var(--muted); }
.sort { position: relative; display: flex; align-items: center; gap: 8px; margin-left: auto; font-size: 14px; color: var(--muted); }
.sort select { appearance: none; height: 40px; padding: 0 34px 0 12px; border-radius: 10px; border: 1px solid var(--line-2); background: #fff; font-weight: 500; color: var(--ink); cursor: pointer; }
.sel-i { position: absolute; right: 10px; pointer-events: none; color: var(--muted); }
.views { display: flex; background: #fff; border-radius: 10px; border: 1px solid var(--line-2); padding: 3px; }
.views button { width: 34px; height: 32px; border-radius: 7px; display: grid; place-items: center; color: var(--muted); }
.views button.on { background: var(--brand-50); color: var(--brand); }

.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.list { display: flex; flex-direction: column; gap: 12px; }

.empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding: 56px 24px; color: var(--muted); }
.empty h2 { color: var(--ink); margin: 8px 0 0; font-size: 20px; }
.empty .btn { margin-top: 12px; }

.pager { display: flex; justify-content: center; gap: 6px; margin-top: 28px; flex-wrap: wrap; }
.pager button { height: 40px; min-width: 40px; padding: 0 12px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; font-size: 14px; font-weight: 500; color: var(--brand); }
.pager button:hover:not(:disabled) { background: #fff; }
.pager button:disabled { color: var(--line-2); cursor: default; }
.pager .num.on { background: var(--brand); color: #fff; }

.only-m { display: none; }
.f-btn { height: 40px; padding: 0 14px; font-size: 14px; }
.f-btn .n { background: var(--brand); color: #fff; border-radius: 9px; font-size: 11px; min-width: 18px; height: 18px; display: grid; place-items: center; }

@media (max-width: 1100px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 860px) {
  .layout { grid-template-columns: 1fr; }
  .only-m { display: inline-flex; }
  .hide-m { display: none; }
  .filters { position: fixed; z-index: 40; top: 0; bottom: 0; left: 0; width: min(340px, 88vw); background: var(--bg); padding: 24px 20px; overflow-y: auto; transform: translateX(-105%); transition: transform .35s var(--ease); }
  .filters.open { transform: none; box-shadow: var(--shadow-lg); }
  .close { position: absolute; right: -4px; top: -4px; width: 40px; height: 40px; place-items: center; }
  .scrim { display: block; position: fixed; inset: 0; z-index: 39; background: rgba(15,18,28,.4); }
  .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
}
</style>
