import axios from 'axios'
import { BASE_URL, TOKEN_KEY } from '../utils/constants'

const api = axios.create({ baseURL: BASE_URL })

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const loginUser    = (data) => api.post('/auth/login', data)
export const registerUser = (data) => api.post('/auth/register', data)

// Devices
export const getDevices       = ()       => api.get('/device/devices')
export const registerDevice   = (data)   => api.post('/device/register-device', data)

// Location
export const sendLocation     = (data)   => api.post('/location/send-location', data)
export const getLocation      = (id)     => api.get(`/location/get-location/${id}`)

// Commands
export const sendCommand      = (data)   => api.post('/command/send-command', data)

// Policies
export const createPolicy     = (data)   => api.post('/policy/create-policy', data)
export const getPolicies      = ()       => api.get('/policy/get-policies')
export const assignPolicy     = (data)   => api.post('/policy/assign-policy', data)
export const getDevicePolicy  = (id)     => api.get(`/policy/device-policy/${id}`)

export default api