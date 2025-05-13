// Importation de la bibliothèque axios pour effectuer des requêtes HTTP
import axios from 'axios'

// Création d'une instance axios avec une configuration par défaut
export const api = axios.create({
  baseURL: 'http://localhost:3000', // URL de base pour les requêtes vers le backend
  withCredentials: true, // Permet d'envoyer les cookies avec les requêtes (utile pour l'authentification)
})
