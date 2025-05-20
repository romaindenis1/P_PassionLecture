import axios from 'axios'
export const api = axios.create({
  baseURL: 'http://localhost:3000', // url base de notre backend
  withCredentials: true,
})

// Ajoute cette fonction :
export function getAuthorIdByName(nom) {
  return api.get(`/auteurs/getAuthorIdByName`, { params: { nom } })
}

export function createAuthor(nom) {
  return api.post('/auteurs', { nom })
}
