// Small helper to centralize API calls and JSON parsing

// Derive API base URL similar to existing usage
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL && process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '')) || "http://localhost:3001"

// Safely join base URL and endpoint to avoid double slashes
const joinUrl = (base, endpoint) => {
  const cleanBase = base.replace(/\/$/, '')
  const cleanEndpoint = (endpoint || '').startsWith('/') ? endpoint : `/${endpoint || ''}`
  return `${cleanBase}${cleanEndpoint}`
}

export const apiFetch = async (endpoint, options = {}) => {
  const url = joinUrl(API_BASE_URL, endpoint)

  const defaultHeaders = { 'Content-Type': 'application/json' }
  const headers = { ...defaultHeaders, ...(options.headers || {}) }

  const res = await fetch(url, { ...options, headers })

  // Always attempt to parse JSON
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}

  // Return parsed body regardless of status; caller handles success/error
  return data
}


