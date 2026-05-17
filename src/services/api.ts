import { useLoadingStore } from '@/stores/loading'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const TOKEN_KEY = 'roadmap-auth-token-v1'

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

async function handleResponse(response: Response) {
  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('roadmap-auth-user-v1')
    window.location.href = '/'
    throw new Error('Sessão expirada. Por favor, faça login novamente.')
  }

  if (!response.ok) {
    try {
      const error = await response.json()
      throw new Error(error.error || `Erro ${response.status}`)
    } catch {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

async function request(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const loadingStore = useLoadingStore()
  loadingStore.show()

  try {
    const token = getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    })

    return handleResponse(response)
  } finally {
    loadingStore.hide()
  }
}

export const api = {
  get: (path: string) => request(path, { method: 'GET' }),

  post: (path: string, body: any) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  put: (path: string, body: any) =>
    request(path, {
      method: 'PUT',
      body: JSON.stringify(body)
    }),

  patch: (path: string, body: any) =>
    request(path, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }),

  delete: (path: string) => request(path, { method: 'DELETE' })
}
