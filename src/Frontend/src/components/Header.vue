<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

const isAuthenticated = ref(false)
const router = useRouter()

onMounted(() => {
  isAuthenticated.value = sessionStorage.getItem('auth') === 'true'
})

const logout = async () => {
  try {
    await api.post('/logout')
  } catch (e) {
    console.error('Erreur déconnexion', e)
  } finally {
    sessionStorage.removeItem('auth')
    isAuthenticated.value = false
    router.push('/login')
  }
}
</script>

<template>
  <header>
    <div>
      <h1>Passion Lecture</h1>
    </div>
    <div>
      <input type="text" placeholder="Rechercher un livre..." />
    </div>
    <div>
      <template v-if="!isAuthenticated">
        <button><a href="/login">Se connecter</a></button>
        <button><a href="/signup">Créer un compte</a></button>
      </template>
      <template v-else>
        <button @click="logout">Déconnexion</button>
        <button><a href="/account">Mon compte</a></button>
      </template>
    </div>
  </header>
</template>
