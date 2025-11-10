import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      return Promise.reject({
        status,
        message: data?.message || 'Request failed',
        details: data?.details,
      })
    }

    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Unable to reach the server. Check your connection.',
      })
    }

    return Promise.reject({ status: 0, message: error.message })
  }
)

export default apiClient
