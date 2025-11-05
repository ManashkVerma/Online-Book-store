import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const fetchBooks = async (params = {}) => {
  const { data } = await api.get('/books', { params })
  return data
}

export const fetchBookById = async (id) => {
  const { data } = await api.get(`/books/${id}`)
  return data
}

export const createOrder = async (order) => {
  const { data } = await api.post('/orders', order)
  return data
}


