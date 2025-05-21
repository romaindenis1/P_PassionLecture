<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()

// Données réactives
const utilisateurs = ref([]) // Liste des utilisateurs
const livres = ref([]) // Liste des livres
const error = ref('') // Message d’erreur
const loading = ref(true) // Indicateur de chargement

// Vérification des droits d’accès à la page admin
const isAuthenticated = sessionStorage.getItem('auth') === 'true'
const isAdmin = sessionStorage.getItem('isAdmin') === '1'

// Chargement des données admin
onMounted(async () => {
  if (!isAuthenticated || !isAdmin) {
    router.push('/') // Redirige si l'utilisateur n'est pas admin
    return
  }

  try {
    const res = await api.get('/admin/data')
    utilisateurs.value = res.data.utilisateurs
    livres.value = res.data.livres
  } catch (err) {
    console.error('Erreur admin/data:', err)
    error.value = 'Erreur lors du chargement des données admin.'
  } finally {
    loading.value = false
  }
})

// Suppression d’un livre (avec confirmation)
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
  <Header></Header>/>

  <main class="admin-container">
    <h1>Page d’administration</h1>

    <!-- Affichage d’un message de chargement -->
    <p v-if="loading">Chargement...</p>

    <!-- Message d’erreur éventuel -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Table des utilisateurs -->
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

    <!-- Table des livres -->
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

  <Footer></Footer> />
</template>

<style scoped>
/* Style du conteneur principal de la page d'administration */
.admin-container {
  padding: 2rem;
}

/* Style des titres */
table {
  width: 100%;
  border-collapse: collapse;
}

/* Style des cellules de la table */
th,
td {
  padding: 8px 12px;
  border: 1px solid #ccc;
  text-align: left;
  color: white;
}

/* Style des lignes de la table */
th {
  background-color: #f3f3f3;
  color: black;
}

/* Style des lignes de la table */
button {
  margin-right: 5px;
}

/* Style des boutons */
.error {
  color: red;
  margin: 1rem 0;
}

/* Style des boutons */
.success {
  border-radius: 3%;
}
</style>
