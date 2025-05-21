<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

// Indique si l'utilisateur est authentifié
const isAuthenticated = ref(false)

// ID de l'utilisateur connecté
const userId = ref(null)

// Statut administrateur
const isAdmin = ref(false)

// Chargement des informations de session au montage
onMounted(() => {
  isAuthenticated.value = sessionStorage.getItem('auth') === 'true'
  userId.value = sessionStorage.getItem('userId')
  isAdmin.value = sessionStorage.getItem('isAdmin') === '1'
})

// Déconnecte l'utilisateur et redirige vers la page de connexion
const logout = async () => {
  try {
    await api.post('/logout')
  } catch (e) {
    console.error('Erreur déconnexion', e)
  } finally {
    sessionStorage.removeItem('auth')
    sessionStorage.removeItem('userId')
    isAuthenticated.value = false
    window.location.href = '/login'
  }
}
</script>

<template>
  <header>
    <h1>
      <router-link to="/">Passion Lecture</router-link>
    </h1>

    <template v-if="!isAuthenticated">
      <router-link to="/login"><button>Se connecter</button></router-link>
      <router-link to="/signup"><button>Créer un compte</button></router-link>
    </template>

    <template v-else>
      <button @click="logout">Déconnexion</button>
      <router-link :to="isAdmin ? '/admin' : `/users/${userId}/livres`">
        <button>Mon compte</button>
      </router-link>
    </template>
  </header>
</template>

<style scoped>
/* Style du header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #242424;
  color: white;
  border-bottom: 2px solid rgb(184, 0, 0);
  height: 80px;
  box-sizing: border-box;
}

/* Logo / Titre */
header h1 {
  margin: 0;
}

/* Zone contenant les boutons */
header template {
  display: flex;
  gap: 10px;
}

/* Style des boutons */
button {
  background-color: hsla(0, 100%, 36%, 0.2);
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Effet au survol (pour les périphériques compatibles) */
button:hover {
  background-color: rgb(184, 0, 0);
}
</style>
