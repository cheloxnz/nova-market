<script setup>
defineProps({ value: Number, count: Number, size: { type: Number, default: 13 } })
</script>

<template>
  <span class="stars" :aria-label="`${value} de 5 estrellas`">
    <span class="row" :style="{ fontSize: size + 'px' }">
      <span class="bg">★★★★★</span>
      <span class="fg" :style="{ width: (value / 5) * 100 + '%' }">★★★★★</span>
    </span>
    <span v-if="count != null" class="count">({{ count.toLocaleString('es-AR') }})</span>
  </span>
</template>

<style scoped>
.stars { display: inline-flex; align-items: center; gap: 6px; }
.row { position: relative; display: inline-block; line-height: 1; letter-spacing: 1px; }
.bg { color: #d9dce3; }
.fg { position: absolute; inset: 0 auto 0 0; overflow: hidden; color: var(--warn); white-space: nowrap; }
.count { font-size: 12px; color: var(--muted); }
</style>
