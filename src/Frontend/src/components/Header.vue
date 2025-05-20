<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

// Déclaration des variables réactives pour l'état d'authentification et l'ID utilisateur
const isAuthenticated = ref(false)
const userId = ref(null)

// Vérification de l'état d'authentification et récupération de l'ID utilisateur au montage du composant
const isAdmin = ref(false)

onMounted(() => {
  isAuthenticated.value = sessionStorage.getItem('auth') === 'true'
  userId.value = sessionStorage.getItem('userId')
  isAdmin.value = sessionStorage.getItem('isAdmin') === '1'
})

// Fonction pour gérer la déconnexion de l'utilisateur
const logout = async () => {
  try {
    // Appel à l'API pour déconnecter l'utilisateur
    await api.post('/logout')
  } catch (e) {
    console.error('Erreur déconnexion', e)
  } finally {
    // Suppression des données de session et redirection vers la page de connexion
    sessionStorage.removeItem('auth')
    sessionStorage.removeItem('userId')
    isAuthenticated.value = false
    window.location.href = '/login'
  }
}
</script>

<template>
  <header>
    <!-- Titre du site avec un lien vers la page d'accueil -->
    <h1>
      <router-link to="/">Passion Lecture</router-link>
    </h1>
    <!-- Affichage des boutons selon l'état d'authentification -->
    <template v-if="!isAuthenticated">
      <!-- Boutons pour se connecter ou créer un compte si non authentifié -->
      <router-link to="/login"><button>Se connecter</button></router-link>
      <router-link to="/signup"><button>Créer un compte</button></router-link>
    </template>
    <template v-else>
      <!-- Bouton pour se déconnecter si authentifié -->
      <button @click="logout">Déconnexion</button>
      <!-- Lien vers la page de l'utilisateur si l'ID utilisateur est disponible -->
      <router-link v-if="isAdmin" to="/admin">
        <button>Mon compte</button>
      </router-link>
      <router-link v-else-if="userId" :to="`/users/${userId}/livres`">
        <button>Mon compte</button>
      </router-link>
    </template>
  </header>
</template>

<style scoped>
/* Style pour l'en-tête */
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

/* Style pour le titre */
header h1 {
  margin: 0;
}

/* Style pour les boutons dans l'en-tête */
header template {
  display: flex;
  gap: 10px;
}

/* Style pour les boutons */
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

/* Style pour le survol des boutons */
button:hover {
  background-color: rgb(184, 0, 0);
}
</style>
