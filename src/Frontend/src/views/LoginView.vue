<script setup>
// Importation des modules nécessaires
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import Footer from '../components/Footer.vue'

// Déclaration des variables réactives pour le formulaire
const username = ref('') // Nom d'utilisateur
const password = ref('') // Mot de passe
const message = ref('') // Message d'erreur ou de succès
const router = useRouter() // Utilisation du routeur pour naviguer

// Fonction pour gérer la connexion
const login = async () => {
  try {
    // Envoi des données de connexion à l'API
    const response = await api.post('/login', {
      username: username.value,
      password: password.value,
    })

    // Stockage des informations utilisateur dans la session
    const userId = response.data.data.utilisateur_id
    sessionStorage.setItem('auth', 'true')
    sessionStorage.setItem('userId', userId)

    // Redirection vers la page des livres
    router.push('/livres')
  } catch (error) {
    // Gestion des erreurs
    message.value = 'Échec de la connexion'
    console.error(error)
  }
}
</script>

<template>
  <div>
    <h1>Se connecter</h1>
    <!-- Formulaire de connexion -->
    <form @submit.prevent="login">
      <div>
        <label>Nom d'utilisateur</label>
        <input v-model="username" type="text" />
      </div>
      <div>
        <label>Mot de passe</label>
        <input v-model="password" type="password" />
      </div>

      <button type="submit">Se connecter</button>
    </form>
    <!-- Affichage des messages -->
    <p>{{ message }}</p>
    <p>Pas encore inscrit ? <a href="/signup">Créer un compte</a></p>
    <Footer></Footer>
  </div>
</template>
