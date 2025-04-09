import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://localhost:3000/',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getBooks() {
    return apiClient.get('/livre')
  },
  getBook(id) {
    return apiClient.get('/books/' + id)
  },
}
