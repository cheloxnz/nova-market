<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import CartToast from './components/CartToast.vue'
import { useShop } from './stores/shop.js'

const shop = useShop()
const route = useRoute()
watch(() => route.path, () => (shop.toast = null))
watch(() => [shop.cart, shop.favorites, shop.zip], () => shop.persist(), { deep: true })
</script>

<template>
  <AppHeader />
  <main class="main">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in"><component :is="Component" /></Transition>
    </RouterView>
  </main>
  <AppFooter />
  <CartToast />
</template>
