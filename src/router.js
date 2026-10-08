import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

// Hash history: funciona en GitHub Pages sin configurar redirects.
export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/search', name: 'search', component: () => import('./views/SearchView.vue') },
    { path: '/p/:id/:slug?', name: 'product', component: () => import('./views/ProductView.vue') },
    { path: '/cart', name: 'cart', component: () => import('./views/CartView.vue') },
    { path: '/checkout', name: 'checkout', component: () => import('./views/CheckoutView.vue') },
    { path: '/favorites', name: 'favorites', component: () => import('./views/FavoritesView.vue') },
    { path: '/:pathMatch(.*)*', name: 'notfound', component: () => import('./views/NotFoundView.vue') },
  ],
  scrollBehavior: (to, from, saved) => saved || { top: 0 },
})
