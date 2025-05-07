<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import Footer from '../components/Footer.vue'

const username = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()

const register = async () => {
  try {
    const response = await api.post('/signup', {
      username: username.value,
      password: password.value,
    })

    const userId = response.data.data.utilisateur_id
    sessionStorage.setItem('auth', 'true')
    sessionStorage.setItem('userId', userId)

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
    <p>{{ message }}</p>
    <p>Déjà inscrit ? <a href="/login">Se connecter</a></p>
    <Footer></Footer>
  </div>
</template>
