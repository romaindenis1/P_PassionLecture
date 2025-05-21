<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import Footer from '../components/Footer.vue'

// Champs du formulaire
const username = ref('')
const password = ref('')
const message = ref('')

const router = useRouter()

// Connexion de l'utilisateur
const login = async () => {
  try {
    const response = await api.post('/login', {
      username: username.value,
      password: password.value,
    })

    const user = response.data.data

    // Stockage des données en session
    sessionStorage.setItem('auth', 'true')
    sessionStorage.setItem('userId', user.utilisateur_id)
    sessionStorage.setItem('isAdmin', user.isAdmin ? '1' : '0')
    sessionStorage.setItem('username', user.username)

    // Redirection selon rôle
    if (user.isAdmin) {
      router.push('/admin')
    } else {
      router.push(`/users/${user.utilisateur_id}`)
    }
  } catch (error) {
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

    <!-- Message d'erreur -->
    <p style="color: red">{{ message }}</p>

    <!-- Lien vers l'inscription -->
    <p>Pas encore inscrit ? <a href="/signup">Créer un compte</a></p>

    <Footer></Footer> />
  </div>
</template>
