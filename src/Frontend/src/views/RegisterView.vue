<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import Footer from '../components/Footer.vue'

// Champs du formulaire d'inscription
const username = ref('')
const password = ref('')
const message = ref('')

const router = useRouter()

// Inscription d’un nouvel utilisateur
const register = async () => {
  try {
    const response = await api.post('/signup', {
      username: username.value,
      password: password.value,
    })

    // Enregistrement de la session
    const userId = response.data.data.utilisateur_id
    sessionStorage.setItem('auth', 'true')
    sessionStorage.setItem('userId', userId)

    // Redirection vers la liste des livres
    router.push('/livres')
  } catch (error) {
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

    <!-- Message d'erreur ou de succès -->
    <p>{{ message }}</p>

    <!-- Lien vers la page de connexion -->
    <p>Déjà inscrit ? <a href="/login">Se connecter</a></p>

    <Footer></Footer>/>
  </div>
</template>
