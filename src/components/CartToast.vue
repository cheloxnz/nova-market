<script setup>
import { useShop } from '../stores/shop.js'
import ProductArt from './ProductArt.vue'
import Icon from './Icon.vue'
const shop = useShop()
</script>

<template>
  <Transition name="toast">
    <div v-if="shop.toast" :key="shop.toast.key" class="toast" role="status">
      <span class="ok-i"><Icon name="check" :size="14" /></span>
      <span class="thumb" v-if="shop.toast.product"><ProductArt :kind="shop.toast.product.kind" :hue="shop.toast.product.hue" /></span>
      <div class="txt">
        <b>{{ shop.toast.title }}</b>
        <span v-if="shop.toast.product">{{ shop.toast.product.title }}</span>
      </div>
      <RouterLink to="/cart" class="btn btn-primary go" @click="shop.toast = null">Ver carrito</RouterLink>
      <button class="x" @click="shop.toast = null" aria-label="Cerrar"><Icon name="close" :size="16" /></button>
    </div>
  </Transition>
</template>

<style scoped>
.toast { position: fixed; z-index: 50; right: 24px; bottom: 24px; width: min(440px, calc(100vw - 32px)); display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 14px; background: #fff; border-radius: 16px; box-shadow: 0 24px 48px -12px rgba(16,24,40,.25); border: 1px solid var(--line); }
.ok-i { position: absolute; top: -8px; left: -8px; width: 24px; height: 24px; border-radius: 50%; background: var(--ok); color: #fff; display: grid; place-items: center; }
.thumb { width: 48px; height: 48px; border-radius: 10px; overflow: hidden; flex: none; }
.txt { flex: 1; min-width: 0; display: flex; flex-direction: column; font-size: 13px; }
.txt b { color: var(--ok); font-size: 14px; }
.txt span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--muted); }
.go { height: 38px; padding: 0 14px; font-size: 13px; }
.x { color: var(--muted); padding: 4px; }
.toast-enter-active, .toast-leave-active { transition: opacity .25s, transform .4s var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(16px) scale(.98); }
@media (max-width: 560px) { .toast { right: 16px; bottom: 16px; } .x { display: none; } }
</style>
