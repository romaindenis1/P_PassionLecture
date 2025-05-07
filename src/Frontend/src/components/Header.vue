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
    window.location.href = '/login' // forcer le changement de page
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
