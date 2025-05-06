import axios from 'axios'
export const api = axios.create({
  baseURL: 'http://localhost:3000', // url base de notre backend
  withCredentials: true,
})
