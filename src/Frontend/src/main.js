// Import des styles globaux
import './assets/main.css'

// Import de Vue et du composant racine
import { createApp } from 'vue'
import App from './App.vue'

// Import du routeur de l'application
import router from './router'

// Création de l'application Vue
const app = createApp(App)

// Activation du routeur
app.use(router)

// Montage de l'application dans l'élément HTML #app
app.mount('#app')
