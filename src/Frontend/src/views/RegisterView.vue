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
  <div class="register-container">
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

    <Footer></Footer>
  </div>
</template>

<style scoped>
h1 {
  color: #fff;
}

.register-container {
  max-width: 350px;
  margin: 2rem auto;
  padding: 2rem 1.5rem 1rem 1.5rem;
  border-radius: 8px;
  background: hsla(0, 100%, 36%, 0.2);
}

form > div {
  margin-bottom: 1rem;
}

label,
p {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #bbb;
}

input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

button[type='submit'] {
  background: #b80000;
  color: #fff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

button[type='submit']:hover {
  background: hsla(0, 100%, 36%, 0.2);
}

p {
  margin-top: 1rem;
  text-align: center;
}
</style>
