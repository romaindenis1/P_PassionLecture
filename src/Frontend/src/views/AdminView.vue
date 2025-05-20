<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()

const utilisateurs = ref([])
const livres = ref([])
const error = ref('')
const loading = ref(true)

const isAuthenticated = sessionStorage.getItem('auth') === 'true'
const isAdmin = sessionStorage.getItem('isAdmin') === '1'

onMounted(async () => {
  if (!isAuthenticated || !isAdmin) {
    router.push('/') // redirection si non-admin
    return
  }

  try {
    const res = await api.get('/admin/data')
    console.log('Données reçues:', res.data)
    utilisateurs.value = res.data.utilisateurs
    livres.value = res.data.livres
  } catch (err) {
    console.error('Erreur admin/data:', err)
    console.error(err)
    error.value = 'Erreur lors du chargement des données admin.'
  } finally {
    loading.value = false
  }
})

const supprimerLivre = async (livreId) => {
  if (!confirm('Voulez-vous vraiment supprimer ce livre ?')) return
  try {
    await api.delete(`/livres/${livreId}`)
    livres.value = livres.value.filter((l) => l.livre_id !== livreId)
  } catch (err) {
    error.value = 'Erreur lors de la suppression du livre.'
  }
}
</script>

<template>
  <Header />
  <main class="admin-container">
    <h1>Page d’administration</h1>
    <p v-if="loading">Chargement...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Liste des utilisateurs -->
    <section v-if="!loading">
      <h2>Utilisateurs</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom d’utilisateur</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in utilisateurs" :key="u.utilisateur_id">
            <td>{{ u.utilisateur_id }}</td>
            <td>{{ u.username }}</td>
            <td>{{ u.isAdmin ? 'Admin' : 'Utilisateur' }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Liste des livres -->
    <section v-if="!loading" style="margin-top: 2rem">
      <h2>Livres</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>

            <th>Ajouté par</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in livres" :key="l.livre_id">
            <td>{{ l.livre_id }}</td>
            <td>{{ l.titre }}</td>

            <td>{{ l.utilisateur?.username || 'N/A' }}</td>
            <td>
              <router-link :to="`/modify-book/${l.livre_id}`">
                <button>Modifier</button>
              </router-link>
              <button @click="supprimerLivre(l.livre_id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
  <Footer />
</template>

<style scoped>
.admin-container {
  padding: 2rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px 12px;
  border: 1px solid #ccc;
  text-align: left;
  color: white;
}
th {
  background-color: #f3f3f3;
  color: black;
}
button {
  margin-right: 5px;
}
.error {
  color: red;
  margin: 1rem 0;
}

.success {
  border-radius: 3%;
}
</style>
