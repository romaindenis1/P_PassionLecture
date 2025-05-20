<script setup>
// Importation des modules nécessaires
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import Footer from '../components/Footer.vue'

// Déclaration des variables réactives pour le formulaire
const username = ref('') // Nom d'utilisateur
const password = ref('') // Mot de passe
const message = ref('') // Message d'erreur ou de succès
const router = useRouter() // Utilisation du routeur pour naviguer

// Fonction pour gérer l'inscription
const register = async () => {
  try {
    // Envoi des données d'inscription à l'API
    const response = await api.post('/signup', {
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
    message.value = 'Erreur lors de l’inscription'
    console.error(error)
  }
}
</script>

<template>
  <div>
    <h1>Créer un compte</h1>
    <!-- Formulaire d'inscription -->
    <form @submit.prevent="register">
      <div>
        <label>Nom d'utilisateur</label>
        <input v-model="username" type="text" />
      </div>
      <div>
        <label>Mot de passe</label>
        <input v-model="password" type="password" />
      </div>

      <button type="submit">Créer un compte</button>
    </form>
    <!-- Affichage des messages -->
    <p>{{ message }}</p>
    <p>Déjà inscrit ? <a href="/login">Se connecter</a></p>
    <Footer></Footer>
  </div>
</template>
