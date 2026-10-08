<template>
  <div class="container nf">
    <div class="card box">
      <b class="code">404</b>
      <h1>Esta página no existe</h1>
      <p class="muted">Puede que el link esté roto o que la página se haya movido.</p>
      <RouterLink to="/" class="btn btn-primary">Ir al inicio</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.nf { padding-top: 40px; }
.box { padding: 64px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.code { font-size: 72px; letter-spacing: -.05em; color: var(--brand); line-height: 1; }
h1 { margin: 8px 0 0; }
.btn { margin-top: 16px; }
</style>
