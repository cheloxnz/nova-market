<script setup>
import { ref, reactive, computed } from 'vue'
import ProductArt from '../components/ProductArt.vue'
import Icon from '../components/Icon.vue'
import { useShop } from '../stores/shop.js'
import { money } from '../data/products.js'

const shop = useShop()
const step = ref(1)
const steps = ['Envío', 'Pago', 'Revisión']

const form = reactive({ name: '', email: '', phone: '', street: '', zip: '', city: 'Buenos Aires', delivery: 'home' })
const errors = reactive({})
const pay = reactive({ method: 'card', installments: 1 })
const order = ref(null)

const maxInst = computed(() => Math.min(...shop.items.map((i) => i.product.installments), 12))
const instOptions = computed(() => [1, 3, 6, 12].filter((n) => n <= maxInst.value))
const shippingCost = computed(() => (form.delivery === 'pickup' ? 0 : shop.shipping))
const total = computed(() => shop.subtotal + shippingCost.value)

const validate = () => {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (form.name.trim().length < 3) errors.name = 'Ingresá tu nombre completo'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Ingresá un email válido'
  if (form.delivery === 'home') {
    if (form.street.trim().length < 4) errors.street = 'Ingresá calle y número'
    if (!/^[A-Za-z]?\d{4}[A-Za-z]{0,3}$/.test(form.zip.trim())) errors.zip = 'Código postal inválido'
  }
  return !Object.keys(errors).length
}
const next = () => {
  if (step.value === 1 && !validate()) return
  step.value++
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const confirm = () => {
  order.value = {
    id: 'NM-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    total: total.value,
    count: shop.count,
    email: form.email,
  }
  shop.clear()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const methods = [
  { id: 'card', t: 'Tarjeta de crédito', d: 'Hasta 12 cuotas sin interés', icon: 'card' },
  { id: 'debit', t: 'Tarjeta de débito', d: 'Acreditación instantánea', icon: 'card' },
  { id: 'transfer', t: 'Transferencia bancaria', d: 'Se acredita en hasta 1 día hábil', icon: 'store' },
]
</script>

<template>
  <div class="container co">
    <!-- Confirmación -->
    <div v-if="order" class="card done">
      <span class="d-ico"><Icon name="check" :size="40" /></span>
      <h1>¡Listo! Tu compra fue confirmada</h1>
      <p class="muted">Pedido <b>{{ order.id }}</b> · {{ order.count }} producto{{ order.count > 1 ? 's' : '' }} · {{ money(order.total) }}</p>
      <p class="muted">Te enviamos el detalle a <b>{{ order.email }}</b>.</p>
      <p class="demo"><Icon name="lock" :size="14" />Esto es una demo: no se realizó ningún cobro ni envío real.</p>
      <RouterLink to="/" class="btn btn-primary">Seguir comprando</RouterLink>
    </div>

    <div v-else-if="!shop.items.length" class="card done">
      <h1>No hay productos para comprar</h1>
      <RouterLink to="/" class="btn btn-primary">Ir al inicio</RouterLink>
    </div>

    <template v-else>
      <ol class="stepper">
        <li v-for="(s, i) in steps" :key="s" :class="{ on: step === i + 1, ok: step > i + 1 }">
          <span class="n"><Icon v-if="step > i + 1" name="check" :size="14" /><template v-else>{{ i + 1 }}</template></span>{{ s }}
        </li>
      </ol>

      <div class="layout">
        <section class="card main-col">
          <!-- Paso 1 -->
          <div v-if="step === 1">
            <h2>¿Cómo querés recibir tu compra?</h2>
            <div class="radios">
              <label class="radio" :class="{ on: form.delivery === 'home' }">
                <input type="radio" v-model="form.delivery" value="home" />
                <Icon name="truck" />
                <span><b>Envío a domicilio</b><small>{{ shop.shipping === 0 ? 'Gratis' : money(shop.shipping) }} · Llega en 24–72 h</small></span>
              </label>
              <label class="radio" :class="{ on: form.delivery === 'pickup' }">
                <input type="radio" v-model="form.delivery" value="pickup" />
                <Icon name="store" />
                <span><b>Retiro en punto de entrega</b><small>Gratis · Disponible en 48 h</small></span>
              </label>
            </div>

            <h3>Datos de contacto</h3>
            <div class="fields">
              <div class="f full"><label class="label" for="n">Nombre y apellido</label><input id="n" v-model="form.name" class="input" :class="{ err: errors.name }" autocomplete="name" /><small v-if="errors.name">{{ errors.name }}</small></div>
              <div class="f"><label class="label" for="e">Email</label><input id="e" v-model="form.email" type="email" class="input" :class="{ err: errors.email }" autocomplete="email" /><small v-if="errors.email">{{ errors.email }}</small></div>
              <div class="f"><label class="label" for="t">Teléfono <span class="muted">(opcional)</span></label><input id="t" v-model="form.phone" type="tel" class="input" autocomplete="tel" /></div>
            </div>

            <template v-if="form.delivery === 'home'">
              <h3>Domicilio</h3>
              <div class="fields">
                <div class="f full"><label class="label" for="s">Calle y número</label><input id="s" v-model="form.street" class="input" :class="{ err: errors.street }" autocomplete="street-address" /><small v-if="errors.street">{{ errors.street }}</small></div>
                <div class="f"><label class="label" for="z">Código postal</label><input id="z" v-model="form.zip" class="input" :class="{ err: errors.zip }" autocomplete="postal-code" placeholder="Ej: 1425" /><small v-if="errors.zip">{{ errors.zip }}</small></div>
                <div class="f"><label class="label" for="c">Localidad</label><input id="c" v-model="form.city" class="input" autocomplete="address-level2" /></div>
              </div>
            </template>
          </div>

          <!-- Paso 2 -->
          <div v-else-if="step === 2">
            <h2>Elegí cómo pagar</h2>
            <div class="radios">
              <label v-for="m in methods" :key="m.id" class="radio" :class="{ on: pay.method === m.id }">
                <input type="radio" v-model="pay.method" :value="m.id" />
                <Icon :name="m.icon" />
                <span><b>{{ m.t }}</b><small>{{ m.d }}</small></span>
              </label>
            </div>
            <template v-if="pay.method === 'card'">
              <h3>Cuotas</h3>
              <div class="inst">
                <label v-for="n in instOptions" :key="n" class="radio sm" :class="{ on: pay.installments === n }">
                  <input type="radio" v-model="pay.installments" :value="n" />
                  <span><b>{{ n }}x {{ money(total / n) }}</b><small class="ok">{{ n === 1 ? 'Un pago' : 'Sin interés' }}</small></span>
                </label>
              </div>
            </template>
            <p class="demo"><Icon name="lock" :size="14" />Pago simulado: esta demo no solicita ni procesa datos de tarjetas.</p>
          </div>

          <!-- Paso 3 -->
          <div v-else>
            <h2>Revisá y confirmá tu compra</h2>
            <div class="review">
              <div class="rv-b"><span class="muted">Entrega</span><b>{{ form.delivery === 'home' ? `${form.street}, ${form.city} (${form.zip})` : 'Retiro en punto de entrega' }}</b><button class="link" @click="step = 1">Modificar</button></div>
              <div class="rv-b"><span class="muted">Pago</span><b>{{ methods.find(m => m.id === pay.method).t }}{{ pay.method === 'card' ? ` · ${pay.installments}x ${money(total / pay.installments)}` : '' }}</b><button class="link" @click="step = 2">Modificar</button></div>
              <div class="rv-b"><span class="muted">Contacto</span><b>{{ form.name }} · {{ form.email }}</b></div>
            </div>
          </div>

          <div class="nav">
            <button v-if="step > 1" class="btn btn-ghost" @click="step--"><Icon name="chevronL" :size="18" />Volver</button>
            <RouterLink v-else to="/cart" class="btn btn-ghost"><Icon name="chevronL" :size="18" />Carrito</RouterLink>
            <button v-if="step < 3" class="btn btn-primary" @click="next">Continuar</button>
            <button v-else class="btn btn-primary" @click="confirm">Confirmar compra</button>
          </div>
        </section>

        <aside class="card summary">
          <h2>Resumen</h2>
          <ul class="mini">
            <li v-for="it in shop.items" :key="it.id">
              <span class="th"><ProductArt :kind="it.product.kind" :hue="it.product.hue" /><i>{{ it.qty }}</i></span>
              <span class="mt">{{ it.product.title }}</span>
              <span class="price">{{ money(it.product.price * it.qty) }}</span>
            </li>
          </ul>
          <div class="line"><span>Subtotal</span><span class="price">{{ money(shop.subtotal) }}</span></div>
          <div class="line"><span>Envío</span><span class="price" :class="{ ok: shippingCost === 0 }">{{ shippingCost === 0 ? 'Gratis' : money(shippingCost) }}</span></div>
          <div class="line total"><span>Total</span><span class="price">{{ money(total) }}</span></div>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.co { padding-top: 24px; }
.stepper { list-style: none; display: flex; gap: 8px; padding: 0; margin: 0 0 20px; counter-reset: s; }
.stepper li { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--muted); font-weight: 500; }
.stepper li:not(:last-child)::after { content: ''; width: 40px; height: 2px; background: var(--line-2); margin-left: 8px; border-radius: 1px; }
.stepper .n { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; background: var(--line); font-size: 13px; }
.stepper li.on { color: var(--ink); }
.stepper li.on .n { background: var(--brand); color: #fff; }
.stepper li.ok .n { background: var(--ok); color: #fff; }

.layout { display: grid; grid-template-columns: 1fr 380px; gap: 16px; align-items: start; }
.main-col { padding: 28px; }
h2 { font-size: 20px; letter-spacing: -.02em; margin: 0 0 16px; }
h3 { font-size: 15px; margin: 28px 0 12px; }
.radios { display: flex; flex-direction: column; gap: 10px; }
.radio { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid var(--line-2); border-radius: 12px; cursor: pointer; transition: border-color .2s, background .2s; }
.radio:hover { border-color: var(--ink-2); }
.radio.on { border-color: var(--brand); background: var(--brand-50); box-shadow: inset 0 0 0 1px var(--brand); }
.radio input { accent-color: var(--brand); width: 18px; height: 18px; margin: 0; }
.radio span { display: flex; flex-direction: column; }
.radio small { color: var(--muted); font-size: 13px; }
.radio svg { color: var(--brand); }
.inst { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; }
.radio.sm { padding: 12px 14px; }
.fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.f.full { grid-column: 1 / -1; }
.f small { color: var(--danger); font-size: 12.5px; margin-top: 4px; display: block; }
.input.err { border-color: var(--danger); }
.demo { display: flex; align-items: center; gap: 8px; margin: 20px 0 0; padding: 12px 14px; border-radius: 10px; background: var(--surface-2); color: var(--muted); font-size: 13px; }
.review { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 12px; }
.rv-b { display: grid; grid-template-columns: 100px 1fr auto; gap: 12px; padding: 16px; font-size: 14px; align-items: center; }
.rv-b + .rv-b { border-top: 1px solid var(--line); }
.nav { display: flex; justify-content: space-between; margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--line); }

.summary { padding: 24px; position: sticky; top: 140px; display: flex; flex-direction: column; gap: 12px; }
.summary h2 { margin: 0; font-size: 18px; }
.mini { list-style: none; padding: 0 0 12px; margin: 0; display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid var(--line); }
.mini li { display: flex; align-items: center; gap: 12px; font-size: 13px; }
.th { position: relative; width: 48px; height: 48px; border-radius: 10px; overflow: visible; flex: none; }
.th :deep(svg) { border-radius: 10px; }
.th i { position: absolute; top: -6px; right: -6px; min-width: 20px; height: 20px; border-radius: 10px; background: var(--ink-2); color: #fff; font-style: normal; font-size: 11px; font-weight: 700; display: grid; place-items: center; border: 2px solid #fff; }
.mt { flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: var(--ink-2); }
.line { display: flex; justify-content: space-between; font-size: 15px; }
.total { font-size: 20px; font-weight: 650; padding-top: 12px; border-top: 1px solid var(--line); }

.done { max-width: 620px; margin: 24px auto 0; padding: 56px 32px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.done h1 { font-size: 26px; letter-spacing: -.03em; margin: 8px 0; }
.done p { margin: 0; }
.d-ico { width: 84px; height: 84px; border-radius: 50%; background: var(--ok); color: #fff; display: grid; place-items: center; box-shadow: 0 12px 30px -10px rgba(0,166,80,.6); animation: pop .6s var(--ease); }
@keyframes pop { 0% { transform: scale(.3); opacity: 0; } 70% { transform: scale(1.1); } }
.done .btn { margin-top: 18px; }

@media (max-width: 960px) {
  .layout { grid-template-columns: 1fr; }
  .summary { position: static; order: -1; }
}
@media (max-width: 560px) {
  .main-col { padding: 18px; }
  .fields { grid-template-columns: 1fr; }
  .stepper li:not(:last-child)::after { width: 16px; }
  .rv-b { grid-template-columns: 1fr auto; }
  .rv-b span { grid-column: 1 / -1; }
}
</style>
