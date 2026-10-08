<script setup>
const props = defineProps({ modelValue: Number, max: { type: Number, default: 99 } })
const emit = defineEmits(['update:modelValue'])
const set = (v) => emit('update:modelValue', Math.max(1, Math.min(props.max, v)))
</script>

<template>
  <div class="qty">
    <button @click="set(modelValue - 1)" :disabled="modelValue <= 1" aria-label="Restar">−</button>
    <span>{{ modelValue }}</span>
    <button @click="set(modelValue + 1)" :disabled="modelValue >= max" aria-label="Sumar">+</button>
  </div>
</template>

<style scoped>
.qty { display: inline-flex; align-items: center; border: 1px solid var(--line-2); border-radius: 10px; height: 38px; }
button { width: 36px; height: 100%; font-size: 18px; color: var(--brand); }
button:disabled { color: var(--line-2); cursor: default; }
span { min-width: 28px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums; }
</style>
