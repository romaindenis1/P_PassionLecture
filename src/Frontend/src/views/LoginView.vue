<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import Footer from '../components/Footer.vue'

const username = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()

const login = async () => {
  try {
    await api.post('/login', {
      username: username.value,
      password: password.value,
    })

    sessionStorage.setItem('auth', 'true') // 🔥
    router.push('/livres')
  } catch (error) {
    message.value = 'Échec de la connexion'
    console.error(error)
  }
}
</script>

<template>
  <div>
    <h1>Se connecter</h1>
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
    <p>{{ message }}</p>
    <p>Pas encore inscrit ? <a href="/signup">Créer un compte</a></p>
    <Footer></Footer>
  </div>
</template>
