<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

const isAuthenticated = ref(false)
const userId = ref(null)

onMounted(() => {
  isAuthenticated.value = sessionStorage.getItem('auth') === 'true'
  userId.value = sessionStorage.getItem('userId')
})

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
      <router-link v-if="userId" :to="`/users/${userId}/livres`">
        <button>Mon compte</button>
      </router-link>
    </template>
  </header>
</template>

<style scoped>
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

header h1 {
  margin: 0;
}

header template {
  display: flex;
  gap: 10px; 
}

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

button:hover {
  background-color: rgb(184, 0, 0);
}
</style>
