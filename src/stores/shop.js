import { defineStore } from 'pinia'
import { getProduct } from '../data/products.js'

const KEY = 'nova-market'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }

let toastTimer
export const FREE_SHIPPING_FROM = 50000
export const SHIPPING_COST = 6999

export const useShop = defineStore('shop', {
  state: () => {
    const s = load()
    return { cart: s.cart || [], favorites: s.favorites || [], toast: null, zip: s.zip || 'Buenos Aires' }
  },
  getters: {
    items: (s) => s.cart.map((i) => ({ ...i, product: getProduct(i.id) })).filter((i) => i.product),
    count: (s) => s.cart.reduce((a, i) => a + i.qty, 0),
    subtotal() { return this.items.reduce((a, i) => a + i.product.price * i.qty, 0) },
    savings() { return this.items.reduce((a, i) => a + ((i.product.oldPrice || i.product.price) - i.product.price) * i.qty, 0) },
    allFree() { return this.items.every((i) => i.product.freeShipping) },
    shipping() {
      if (!this.items.length) return 0
      return this.allFree || this.subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST
    },
    total() { return this.subtotal + this.shipping },
    isFav: (s) => (id) => s.favorites.includes(id),
  },
  actions: {
    add(id, qty = 1) {
      const p = getProduct(id)
      const it = this.cart.find((i) => i.id === id)
      if (it) it.qty = Math.min(p.stock, it.qty + qty)
      else this.cart.push({ id, qty: Math.min(p.stock, qty) })
      this.notify({ title: 'Agregaste a tu carrito', product: p })
    },
    setQty(id, qty) {
      const it = this.cart.find((i) => i.id === id)
      if (it) it.qty = Math.max(1, Math.min(getProduct(id).stock, qty))
    },
    remove(id) { this.cart = this.cart.filter((i) => i.id !== id) },
    clear() { this.cart = [] },
    toggleFav(id) {
      const on = this.favorites.includes(id)
      this.favorites = on ? this.favorites.filter((x) => x !== id) : [...this.favorites, id]
    },
    notify(t) {
      this.toast = { ...t, key: Date.now() }
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => (this.toast = null), 3200)
    },
    persist() {
      try { localStorage.setItem(KEY, JSON.stringify({ cart: this.cart, favorites: this.favorites, zip: this.zip })) } catch {}
    },
  },
})
