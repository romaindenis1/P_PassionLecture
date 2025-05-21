import axios from 'axios'

// Instance axios configurée pour communiquer avec le backend
export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

// Récupère l'ID d'un auteur à partir de son nom
export function getAuthorIdByName(nom) {
  return api.get('/auteurs/getAuthorIdByName', { params: { nom } })
}

// Crée un nouvel auteur
export function createAuthor(nom) {
  return api.post('/auteurs', { nom })
}
