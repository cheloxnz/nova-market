<script setup>
import { computed } from 'vue'

// Ilustraciones vectoriales propias (sin fotos externas): nítidas en cualquier resolución.
const props = defineProps({
  kind: { type: String, required: true },
  hue: { type: Number, default: 220 },
  bg: { type: Boolean, default: true },
})

const svg = computed(() => {
  const h = props.hue
  const m = `hsl(${h} 72% 56%)`
  const m2 = `hsl(${h} 70% 68%)`
  const d = `hsl(${h} 30% 20%)`
  const l = `hsl(${h} 70% 94%)`
  const w = '#fff'
  const g = '#e9ebf0'
  const k = '#1d2230'
  const A = {
    phone: `<rect x="66" y="28" width="68" height="144" rx="14" fill="${k}"/><rect x="71" y="36" width="58" height="128" rx="9" fill="${m}"/><circle cx="118" cy="50" r="7" fill="${d}"/><circle cx="118" cy="50" r="3" fill="${m2}"/><path d="M71 120 129 70v94H80a9 9 0 0 1-9-9z" fill="${m2}" opacity=".55"/>`,
    laptop: `<rect x="44" y="52" width="112" height="76" rx="7" fill="${k}"/><rect x="50" y="58" width="100" height="64" rx="3" fill="${m}"/><path d="M50 108 98 72l52 30v20H50z" fill="${m2}" opacity=".6"/><path d="M28 132h144l-8 14H36z" fill="${g}"/><rect x="88" y="132" width="24" height="4" rx="2" fill="#cfd3dc"/>`,
    headphones: `<path d="M48 120V96a52 52 0 0 1 104 0v24" fill="none" stroke="${k}" stroke-width="10" stroke-linecap="round"/><rect x="36" y="104" width="34" height="56" rx="14" fill="${m}"/><rect x="130" y="104" width="34" height="56" rx="14" fill="${m}"/><rect x="58" y="112" width="12" height="40" rx="5" fill="${d}"/><rect x="130" y="112" width="12" height="40" rx="5" fill="${d}"/>`,
    watch: `<rect x="80" y="26" width="40" height="40" rx="8" fill="${m}"/><rect x="80" y="134" width="40" height="40" rx="8" fill="${m}"/><rect x="62" y="58" width="76" height="84" rx="22" fill="${k}"/><rect x="70" y="66" width="60" height="68" rx="16" fill="${d}"/><path d="M100 82v20l12 8" stroke="${m2}" stroke-width="5" stroke-linecap="round" fill="none"/><rect x="138" y="88" width="6" height="18" rx="3" fill="${k}"/>`,
    speaker: `<rect x="40" y="70" width="120" height="70" rx="35" fill="${m}"/><rect x="40" y="70" width="120" height="70" rx="35" fill="none" stroke="${d}" stroke-width="4"/><circle cx="74" cy="105" r="20" fill="${d}"/><circle cx="126" cy="105" r="20" fill="${d}"/><circle cx="74" cy="105" r="8" fill="${m2}"/><circle cx="126" cy="105" r="8" fill="${m2}"/><rect x="88" y="62" width="24" height="8" rx="4" fill="${k}"/>`,
    camera: `<rect x="36" y="64" width="128" height="84" rx="14" fill="${k}"/><rect x="56" y="52" width="36" height="16" rx="5" fill="${k}"/><circle cx="104" cy="106" r="32" fill="${g}"/><circle cx="104" cy="106" r="24" fill="${d}"/><circle cx="104" cy="106" r="13" fill="${m}"/><circle cx="98" cy="100" r="4" fill="${w}" opacity=".7"/><rect x="138" y="74" width="16" height="8" rx="3" fill="${m}"/>`,
    coffee: `<rect x="52" y="34" width="96" height="30" rx="8" fill="${k}"/><rect x="58" y="64" width="84" height="80" rx="4" fill="${m}"/><rect x="52" y="144" width="96" height="20" rx="6" fill="${k}"/><rect x="88" y="64" width="24" height="12" fill="${d}"/><rect x="84" y="108" width="32" height="30" rx="5" fill="${w}"/><path d="M116 114h6a7 7 0 0 1 0 14h-6" fill="none" stroke="${w}" stroke-width="4"/><circle cx="128" cy="48" r="5" fill="${m2}"/>`,
    blender: `<path d="M70 40h60l-8 80H78z" fill="${l}" stroke="${k}" stroke-width="5" stroke-linejoin="round"/><path d="M75 78h50l-4 42H79z" fill="${m2}"/><rect x="66" y="30" width="68" height="12" rx="5" fill="${k}"/><path d="M74 120h52l6 42H68z" fill="${m}"/><circle cx="100" cy="142" r="8" fill="${d}"/>`,
    tv: `<rect x="26" y="40" width="148" height="96" rx="6" fill="${k}"/><rect x="32" y="46" width="136" height="84" rx="3" fill="${m}"/><path d="M32 112c30-30 60-10 82-34 18-20 38-18 54-10v62H32z" fill="${m2}" opacity=".7"/><path d="M76 136l-10 24M124 136l10 24" stroke="${k}" stroke-width="6" stroke-linecap="round"/><rect x="58" y="158" width="84" height="6" rx="3" fill="${g}"/>`,
    lamp: `<path d="M68 34h64l16 44H52z" fill="${m}"/><path d="M68 34h64l4 12H64z" fill="${m2}"/><rect x="97" y="78" width="6" height="80" fill="${k}"/><ellipse cx="100" cy="164" rx="30" ry="8" fill="${k}"/><ellipse cx="100" cy="82" rx="18" ry="5" fill="#fff6c9"/>`,
    chair: `<rect x="62" y="28" width="76" height="70" rx="20" fill="${m}"/><rect x="72" y="38" width="56" height="50" rx="14" fill="${m2}" opacity=".5"/><rect x="56" y="98" width="88" height="20" rx="10" fill="${d}"/><rect x="97" y="118" width="6" height="26" fill="${k}"/><path d="M64 160l36-14 36 14" stroke="${k}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="64" cy="164" r="5" fill="${k}"/><circle cx="136" cy="164" r="5" fill="${k}"/><circle cx="100" cy="164" r="5" fill="${k}"/>`,
    mug: `<path d="M54 64h72v66a20 20 0 0 1-20 20H74a20 20 0 0 1-20-20z" fill="${m}"/><path d="M126 80h10a18 18 0 0 1 0 36h-10" fill="none" stroke="${m}" stroke-width="10"/><rect x="54" y="88" width="72" height="12" fill="${m2}"/><path d="M78 40c-6 8 6 10 0 18M98 36c-6 8 6 10 0 18" stroke="#c6cad3" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    plant: `<path d="M100 112C70 104 50 80 56 50c26 6 42 30 44 62z" fill="${m}"/><path d="M100 112c28-10 46-34 40-66-26 8-40 34-40 66z" fill="${m2}"/><path d="M100 112c-4-28 4-54 18-72" stroke="${d}" stroke-width="4" fill="none"/><path d="M68 112h64l-8 52H76z" fill="${g}"/><rect x="64" y="108" width="72" height="12" rx="4" fill="#d6d9e1"/>`,
    bike: `<circle cx="56" cy="128" r="30" fill="none" stroke="${k}" stroke-width="7"/><circle cx="144" cy="128" r="30" fill="none" stroke="${k}" stroke-width="7"/><path d="M56 128l30-50h44l14 50M86 78l26 50h32M100 128l-14-50M80 64h18M124 78l6-18h14" stroke="${m}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="128" r="6" fill="${d}"/>`,
    dumbbell: `<rect x="62" y="94" width="76" height="12" rx="6" fill="${g}" stroke="#c9cdd6" stroke-width="2"/><rect x="36" y="64" width="22" height="72" rx="6" fill="${m}"/><rect x="142" y="64" width="22" height="72" rx="6" fill="${m}"/><rect x="24" y="76" width="16" height="48" rx="5" fill="${d}"/><rect x="160" y="76" width="16" height="48" rx="5" fill="${d}"/>`,
    bottle: `<rect x="84" y="24" width="32" height="18" rx="5" fill="${k}"/><path d="M78 50a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v8l6 10v96a12 12 0 0 1-12 12H84a12 12 0 0 1-12-12V68l6-10z" fill="${m}"/><rect x="72" y="92" width="56" height="40" fill="${m2}" opacity=".6"/><rect x="82" y="66" width="6" height="96" rx="3" fill="${w}" opacity=".35"/>`,
    sneaker: `<path d="M30 132c0-14 6-36 16-46 8 8 22 12 32 4l20 18c14 10 40 10 58 14 12 3 16 10 16 18H30z" fill="${m}"/><path d="M30 140h142v8a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6z" fill="${w}" stroke="#d5d8df" stroke-width="2"/><path d="M84 100l8-8M96 108l8-8M108 116l8-8" stroke="${w}" stroke-width="4" stroke-linecap="round"/><path d="M46 86c4 18 18 30 40 34" stroke="${d}" stroke-width="4" fill="none" opacity=".5"/>`,
    backpack: `<path d="M82 46a18 18 0 0 1 36 0" fill="none" stroke="${k}" stroke-width="7"/><rect x="54" y="44" width="92" height="124" rx="26" fill="${m}"/><rect x="68" y="100" width="64" height="48" rx="12" fill="${d}"/><rect x="68" y="100" width="64" height="10" rx="5" fill="${k}" opacity=".5"/><rect x="94" y="114" width="12" height="6" rx="3" fill="${m2}"/><path d="M66 62h68" stroke="${m2}" stroke-width="4" stroke-linecap="round"/>`,
    tshirt: `<path d="M74 36c6 12 46 12 52 0l36 18-14 30-16-8v84H68V76l-16 8-14-30z" fill="${m}"/><path d="M74 36c6 12 46 12 52 0" fill="none" stroke="${d}" stroke-width="5"/><rect x="88" y="92" width="24" height="24" rx="6" fill="${m2}"/>`,
    glasses: `<rect x="30" y="80" width="62" height="48" rx="20" fill="${d}"/><rect x="108" y="80" width="62" height="48" rx="20" fill="${d}"/><path d="M92 96c4-6 12-6 16 0" stroke="${k}" stroke-width="6" fill="none"/><path d="M30 92 18 84M170 92l12-8" stroke="${k}" stroke-width="6" stroke-linecap="round"/><path d="M40 112l22-24M118 112l22-24" stroke="${m2}" stroke-width="5" stroke-linecap="round" opacity=".7"/><rect x="30" y="80" width="62" height="48" rx="20" fill="none" stroke="${m}" stroke-width="4"/><rect x="108" y="80" width="62" height="48" rx="20" fill="none" stroke="${m}" stroke-width="4"/>`,
    controller: `<path d="M56 70h88c18 0 30 18 34 46 4 26-6 40-18 40-14 0-20-22-34-22H74c-14 0-20 22-34 22-12 0-22-14-18-40 4-28 16-46 34-46z" fill="${k}"/><path d="M62 96v24M50 108h24" stroke="${w}" stroke-width="7" stroke-linecap="round"/><circle cx="138" cy="98" r="7" fill="${m}"/><circle cx="152" cy="112" r="7" fill="${m2}"/><circle cx="124" cy="112" r="7" fill="${m2}"/><circle cx="138" cy="126" r="7" fill="${m}"/>`,
    keyboard: `<rect x="22" y="66" width="156" height="72" rx="10" fill="${k}"/>${Array.from({ length: 3 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<rect x="${32 + c * 14}" y="${76 + r * 15}" width="11" height="11" rx="2" fill="hsl(${(h + c * 18 + r * 30) % 360} 75% 62%)"/>`).join('')).join('')}<rect x="60" y="121" width="80" height="9" rx="2" fill="${m}"/>`,
    monitor: `<rect x="24" y="36" width="152" height="96" rx="6" fill="${k}"/><rect x="30" y="42" width="140" height="84" rx="3" fill="${d}"/><path d="M30 126V96l36-22 30 18 40-30 34 20v44z" fill="${m}"/><circle cx="62" cy="64" r="8" fill="${m2}"/><path d="M92 132h16l6 20H86z" fill="${k}"/><rect x="66" y="152" width="68" height="8" rx="4" fill="${k}"/>`,
    mouse: `<rect x="66" y="34" width="68" height="128" rx="34" fill="${k}"/><path d="M100 34v44" stroke="${d}" stroke-width="4"/><rect x="95" y="52" width="10" height="20" rx="5" fill="${m}"/><path d="M66 120c20 12 48 12 68 0" stroke="${m}" stroke-width="5" fill="none"/>`,
  }
  return A[props.kind] || A.phone
})
</script>

<template>
  <svg viewBox="0 0 200 200" class="art" role="img" :aria-label="kind">
    <template v-if="bg">
      <rect width="200" height="200" :fill="`hsl(${hue} 60% 96%)`" />
      <circle cx="100" cy="104" r="78" :fill="`hsl(${hue} 70% 91%)`" />
    </template>
    <ellipse cx="100" cy="176" rx="56" ry="6" fill="rgba(20,25,40,.08)" />
    <g v-html="svg" />
  </svg>
</template>

<style scoped>
.art { width: 100%; height: 100%; display: block; }
</style>
