// Importation du fichier CSS principal pour les styles globaux
import './assets/main.css'

// Importation des fonctions nécessaires de Vue
import { createApp } from 'vue'
// Importation du routeur pour gérer la navigation entre les pages
import router from './router'
// Importation du composant racine de l'application
import App from './App.vue'

// Création de l'application Vue à partir du composant racine
const app = createApp(App)

// Ajout du routeur à l'application pour activer la navigation
app.use(router)

// Montage de l'application sur l'élément HTML avec l'id "app"
app.mount('#app')
