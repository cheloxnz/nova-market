import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource-variable/inter'
import './styles.css'
import App from './App.vue'
import router from './router.js'

createApp(App).use(createPinia()).use(router).mount('#app')
