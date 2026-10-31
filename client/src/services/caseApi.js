import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s to allow Gemini generation time
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function extractErrorMessage(error) {
  if (!error.response) {
    return 'Unable to connect. Please check your connection.'
  }
  const data = error.response.data
  if (data?.error?.message) return data.error.message
  if (data?.message) return data.message
  if (data?.error) return typeof data.error === 'string' ? data.error : 'An error occurred.'
  const status = error.response.status
  if (status === 404) return 'This mystery could not be found.'
  if (status === 409) return data?.error?.code === 'CASE_ALREADY_COMPLETED'
    ? 'CASE_ALREADY_COMPLETED'
    : data?.error?.code === 'NO_HINTS_REMAINING'
      ? 'You have used all available hints.'
      : 'Conflict error.'
  if (status >= 500) return 'Mystery generation is temporarily unavailable. Please try again.'
  return 'An unexpected error occurred.'
}

// ── Case APIs ─────────────────────────────────────────────────────────────

export async function createCase(premise, difficulty) {
  try {
    const res = await api.post('/cases', { premise, difficulty })
    return res.data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function getCase(id) {
  try {
    const res = await api.get(`/cases/${id}`)
    return res.data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function discoverClue(caseId, clueId) {
  try {
    const res = await api.post(`/cases/${caseId}/clues/${clueId}/discover`)
    return res.data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function requestHint(caseId) {
  try {
    const res = await api.post(`/cases/${caseId}/hints`)
    return res.data
  } catch (error) {
    const msg = extractErrorMessage(error)
    throw new Error(msg)
  }
}

export async function submitAccusation(caseId, suspectId) {
  try {
    const res = await api.post(`/cases/${caseId}/accuse`, { suspectId })
    return res.data
  } catch (error) {
    const msg = extractErrorMessage(error)
    if (msg === 'CASE_ALREADY_COMPLETED') throw new Error('CASE_ALREADY_COMPLETED')
    throw new Error(msg)
  }
}

export async function getResult(caseId) {
  try {
    const res = await api.get(`/cases/${caseId}/result`)
    return res.data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

// ── Auth APIs ─────────────────────────────────────────────────────────────

export async function registerUser(username, email, password) {
  try {
    const res = await api.post('/auth/register', { username, email, password })
    return res.data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function loginUser(emailOrUsername, password) {
  try {
    const res = await api.post('/auth/login', { emailOrUsername, password })
    return res.data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function getCurrentUser() {
  try {
    const res = await api.get('/auth/me')
    return res.data.user
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function getMyCases() {
  try {
    const res = await api.get('/auth/my-cases')
    return res.data.cases
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}
