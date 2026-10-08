<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from './Icon.vue'
import ProductArt from './ProductArt.vue'
import { useShop } from '../stores/shop.js'
import { products, categories, money } from '../data/products.js'

const shop = useShop()
const router = useRouter()
const route = useRoute()

const q = ref('')
const focused = ref(false)
const active = ref(-1)
const scrolled = ref(false)
const menu = ref(false)

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const suggestions = computed(() => {
  const t = norm(q.value.trim())
  if (t.length < 2) return []
  return products.filter((p) => norm(p.title + ' ' + p.brand).includes(t)).slice(0, 6)
})
const open = computed(() => focused.value && suggestions.value.length > 0)

const submit = () => {
  if (active.value >= 0 && suggestions.value[active.value]) return go(suggestions.value[active.value])
  router.push({ name: 'search', query: q.value.trim() ? { q: q.value.trim() } : {} })
  focused.value = false
  document.activeElement?.blur()
}
const go = (p) => {
  router.push({ name: 'product', params: { id: p.id, slug: p.slug } })
  focused.value = false
  document.activeElement?.blur()
}
const move = (d) => {
  if (!open.value) return
  const n = suggestions.value.length
  active.value = (active.value + d + n) % n
}
watch(q, () => (active.value = -1))
watch(() => route.query.q, (v) => (q.value = v || ''), { immediate: true })
watch(() => route.fullPath, () => (menu.value = false))

const onBlur = () => setTimeout(() => (focused.value = false), 150)
const onScroll = () => (scrolled.value = window.scrollY > 4)
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="hd" :class="{ scrolled }">
    <div class="container top">
      <button class="icon-btn only-m" @click="menu = !menu" aria-label="Menú"><Icon :name="menu ? 'close' : 'menu'" :size="22" /></button>

      <RouterLink to="/" class="logo" aria-label="Nova Market — inicio">
        <span class="mark"><svg viewBox="0 0 24 24"><path d="M7 17V7l10 10V7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
        <span class="word">nova<span>market</span></span>
      </RouterLink>

      <form class="search" role="search" @submit.prevent="submit">
        <Icon name="search" :size="18" class="s-ico" />
        <input v-model="q" type="search" placeholder="Buscar productos, marcas y más…" aria-label="Buscar"
               autocomplete="off" @focus="focused = true" @blur="onBlur"
               @keydown.down.prevent="move(1)" @keydown.up.prevent="move(-1)" @keydown.esc="focused = false" />
        <button class="s-btn" type="submit">Buscar</button>

        <Transition name="drop">
          <ul v-if="open" class="sugg" role="listbox">
            <li v-for="(p, i) in suggestions" :key="p.id" :class="{ on: i === active }" @mousedown.prevent="go(p)" role="option">
              <span class="thumb"><ProductArt :kind="p.kind" :hue="p.hue" /></span>
              <span class="st">{{ p.title }}</span>
              <span class="sp price">{{ money(p.price) }}</span>
            </li>
            <li class="all" @mousedown.prevent="submit">Ver todos los resultados para “{{ q }}”</li>
          </ul>
        </Transition>
      </form>

      <nav class="actions">
        <RouterLink to="/favorites" class="icon-btn hide-m" aria-label="Favoritos">
          <Icon name="heart" />
          <span v-if="shop.favorites.length" class="dot-n">{{ shop.favorites.length }}</span>
        </RouterLink>
        <a href="#" class="icon-btn hide-m" aria-label="Mi cuenta" @click.prevent><Icon name="user" /></a>
        <RouterLink to="/cart" class="cart-btn" aria-label="Carrito">
          <Icon name="cart" :size="22" />
          <Transition name="pop" mode="out-in"><span v-if="shop.count" :key="shop.count" class="dot-n">{{ shop.count }}</span></Transition>
        </RouterLink>
      </nav>
    </div>

    <div class="container sub hide-m">
      <button class="loc"><Icon name="pin" :size="16" /><span><small>Enviar a</small>{{ shop.zip }}</span></button>
      <nav class="cats">
        <RouterLink v-for="c in categories" :key="c.id" :to="{ name: 'search', query: { cat: c.id } }"
                    :class="{ on: route.query.cat === c.id }">{{ c.name }}</RouterLink>
        <RouterLink :to="{ name: 'search', query: { deals: 1 } }" class="hot">Ofertas</RouterLink>
      </nav>
    </div>
  </header>

  <Transition name="drawer">
    <div v-if="menu" class="drawer" @click.self="menu = false">
      <nav>
        <p class="d-t">Categorías</p>
        <RouterLink v-for="c in categories" :key="c.id" :to="{ name: 'search', query: { cat: c.id } }">{{ c.name }}<Icon name="chevronR" :size="16" /></RouterLink>
        <RouterLink :to="{ name: 'search', query: { deals: 1 } }">Ofertas<Icon name="chevronR" :size="16" /></RouterLink>
        <p class="d-t">Mi cuenta</p>
        <RouterLink to="/favorites">Favoritos<Icon name="chevronR" :size="16" /></RouterLink>
        <RouterLink to="/cart">Carrito<Icon name="chevronR" :size="16" /></RouterLink>
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
.hd { position: sticky; top: 0; z-index: 30; background: rgba(255,255,255,.9); backdrop-filter: saturate(1.6) blur(14px); -webkit-backdrop-filter: saturate(1.6) blur(14px); border-bottom: 1px solid var(--line); transition: box-shadow .3s; }
.hd.scrolled { box-shadow: 0 6px 24px -12px rgba(16,24,40,.18); }
.top { display: flex; align-items: center; gap: 28px; height: 72px; }
.logo { display: flex; align-items: center; gap: 10px; flex: none; }
.mark { width: 34px; height: 34px; border-radius: 10px; background: var(--brand); display: grid; place-items: center; box-shadow: 0 6px 16px -6px rgba(47,91,255,.6); }
.mark svg { width: 22px; height: 22px; }
.word { font-weight: 700; font-size: 20px; letter-spacing: -.04em; }
.word span { font-weight: 400; color: var(--muted); }

.search { position: relative; flex: 1; max-width: 640px; display: flex; align-items: center; height: 46px; background: var(--surface-2); border: 1px solid var(--line); border-radius: 12px; transition: border-color .2s, box-shadow .2s, background .2s; }
.search:focus-within { background: #fff; border-color: var(--brand); box-shadow: 0 0 0 4px rgba(47,91,255,.12); }
.s-ico { position: absolute; left: 14px; color: var(--muted); }
.search input { flex: 1; height: 100%; border: 0; background: none; outline: none; padding: 0 12px 0 42px; min-width: 0; }
.search input::-webkit-search-cancel-button { display: none; }
.s-btn { height: 36px; margin-right: 5px; padding: 0 16px; border-radius: 8px; background: var(--ink); color: #fff; font-weight: 600; font-size: 14px; }
.s-btn:hover { background: #000; }

.sugg { position: absolute; top: calc(100% + 8px); left: 0; right: 0; list-style: none; margin: 0; padding: 6px; background: #fff; border-radius: 14px; box-shadow: var(--shadow-lg); border: 1px solid var(--line); }
.sugg li { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 10px; cursor: pointer; }
.sugg li.on, .sugg li:hover { background: var(--surface-2); }
.thumb { width: 40px; height: 40px; border-radius: 8px; overflow: hidden; flex: none; }
.st { flex: 1; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp { font-size: 14px; font-weight: 600; }
.sugg .all { color: var(--brand); font-size: 14px; font-weight: 500; justify-content: center; border-top: 1px solid var(--line); border-radius: 0 0 10px 10px; margin-top: 4px; }

.actions { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.icon-btn, .cart-btn { position: relative; width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; color: var(--ink-2); transition: background .2s; }
.icon-btn:hover, .cart-btn:hover { background: var(--surface-2); }
.cart-btn { background: var(--brand-50); color: var(--brand); }
.dot-n { position: absolute; top: 4px; right: 3px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--brand); color: #fff; font-size: 11px; font-weight: 700; display: grid; place-items: center; border: 2px solid #fff; }

.sub { display: flex; align-items: center; gap: 28px; height: 44px; font-size: 14px; }
.loc { display: flex; align-items: center; gap: 6px; color: var(--ink-2); flex: none; }
.loc span { display: flex; flex-direction: column; line-height: 1.1; text-align: left; font-weight: 500; }
.loc small { font-size: 11px; color: var(--muted); font-weight: 400; }
.cats { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
.cats a { padding: 6px 10px; border-radius: 8px; color: var(--ink-2); white-space: nowrap; transition: background .2s, color .2s; }
.cats a:hover { background: var(--surface-2); color: var(--ink); }
.cats a.on { color: var(--brand); background: var(--brand-50); }
.cats .hot { color: var(--danger); font-weight: 600; }

.only-m { display: none; }
.drawer { position: fixed; inset: 0; z-index: 29; background: rgba(15,18,28,.4); }
.drawer nav { position: absolute; top: 0; bottom: 0; left: 0; width: min(320px, 86vw); background: #fff; padding: 140px 16px 24px; overflow-y: auto; }
.drawer a { display: flex; justify-content: space-between; align-items: center; padding: 14px 8px; border-bottom: 1px solid var(--line); font-weight: 500; }
.d-t { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin: 20px 8px 4px; }
.drawer-enter-active, .drawer-leave-active { transition: opacity .3s; }
.drawer-enter-active nav, .drawer-leave-active nav { transition: transform .35s var(--ease); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from nav, .drawer-leave-to nav { transform: translateX(-100%); }

.drop-enter-active, .drop-leave-active { transition: opacity .15s, transform .2s var(--ease); }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-4px); }
.pop-enter-active { animation: pop .35s var(--ease); }
@keyframes pop { 0% { transform: scale(.4); } 70% { transform: scale(1.2); } }

@media (max-width: 860px) {
  .top { flex-wrap: wrap; height: auto; padding-top: 10px; padding-bottom: 10px; gap: 10px 8px; }
  .search { order: 3; flex-basis: 100%; max-width: none; }
  .only-m { display: grid; }
  .hide-m { display: none !important; }
  .logo { margin-right: auto; }
}
</style>
