<script setup>
// Définition des propriétés passées au composant, ici un objet "livre"
defineProps({
  livre: Object,
})
</script>

<template>
  <!-- Lien vers la page du livre spécifique -->
  <router-link :to="`/livres/${livre.livre_id}`" class="livre-card">
    <div class="livre-card">
      <!-- Affichage de l'image de couverture du livre -->
      <img
        :src="`http://localhost:3000${livre.imageCouverturePath}`"
        alt="Couverture"
        class="livre-cover"
      />
      <div class="livre-details">
        <!-- Affichage du titre du livre -->
        <h2>{{ livre.titre }}</h2>
        <!-- Affichage du nom de l'auteur ou "Inconnu" si non disponible -->
        <p>Auteur : {{ livre.auteur?.nom || 'Inconnu' }}</p>
        <!-- Affichage de la catégorie du livre ou "Non classé" si non disponible -->
        <p>Catégorie : {{ livre.categorie?.libelle || 'Non classé' }}</p>
        <p>
          <!-- Lien vers les livres ajoutés par l'utilisateur si disponible -->
          <router-link
            v-if="livre.utilisateur"
            :to="`/users/${livre.utilisateur.utilisateur_id}/livres`"
            >Ajouté par :
            {{ livre.utilisateur?.username }}
          </router-link>
          <!-- Sinon, afficher "Ajouté par : Inconnu" -->
          <span v-else>Ajouté par : Inconnu</span>
        </p>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
/* Style pour la carte du livre */
.livre-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 3%;
  margin-bottom: 3%;
  margin-left: 3%;
  border-radius: 3%;
}

/* Style pour l'image de couverture */
.livre-cover {
  width: 250px;
  height: 350px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 0%;
}

/* Style pour les détails du livre */
.livre-details {
  flex: 1;
}

/* Style pour une grille de cartes de livres */
.livre-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
</style>
