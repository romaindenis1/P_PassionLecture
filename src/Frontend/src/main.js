import './assets/main.css'
import { api } from './services/api'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(router)

app.mount('#app')
