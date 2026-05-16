import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoadmapStore } from './roadmap'
import { useDailyLogStore } from './dailyLog'
import { useTeacherRankingStore } from './teacherRanking'
import { syncManager } from '@/services/sync'

type User = {
  id: string
  email: string
  isAdmin?: boolean
}

type ApiResponse = {
  user: User
  token: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const STORAGE_KEY = 'roadmap-auth-token-v1'
const USER_STORAGE_KEY = 'roadmap-auth-user-v1'

// Funções locais (mantidas para uso offline futuro)
function randomToken(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

function toB64(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes)
  let str = ''
  for (const b of arr) str += String.fromCharCode(b)
  return btoa(str)
}

function fromB64(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function pbkdf2Hash(password: string, salt: Uint8Array, iterations: number): Promise<ArrayBuffer> {
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  return await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    baseKey,
    256
  )
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const hasAccount = computed(() => Boolean(token.value))
  const isLoggedIn = computed(() => Boolean(token.value))
  const username = computed(() => user.value?.email || null)
  const isAdmin = computed(() => user.value?.isAdmin === true)

  function init() {
    const storedToken = localStorage.getItem(STORAGE_KEY)
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)

    if (storedToken) {
      token.value = storedToken
    }
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        user.value = null
      }
    }
  }

  async function register(email: string, password: string) {
    const emailClean = email.trim()
    if (!emailClean) throw new Error('Digite um e-mail')
    if (!emailClean.includes('@')) throw new Error('E-mail inválido')
    if (password.length < 6) throw new Error('A senha deve ter no mínimo 6 caracteres')

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao registrar')
      }

      const data: ApiResponse = await response.json()
      user.value = data.user
      token.value = data.token

      localStorage.setItem(STORAGE_KEY, token.value)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user.value))
    } catch (error) {
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão com o servidor')
      }
      throw error
    }
  }

  async function login(email: string, password: string) {
    const emailClean = email.trim()
    if (!emailClean) throw new Error('Digite um e-mail')
    if (!emailClean.includes('@')) throw new Error('E-mail inválido')
    if (!password) throw new Error('Digite a senha')

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao fazer login')
      }

      const data: ApiResponse = await response.json()
      user.value = data.user
      token.value = data.token

      localStorage.setItem(STORAGE_KEY, token.value)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user.value))
    } catch (error) {
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão com o servidor')
      }
      throw error
    }
  }

  async function logout() {
    // Se houver mudanças pendentes, sincronizar antes de deslogar
    if (syncManager.hasPendingChanges()) {
      await syncManager.sync()
    }

    user.value = null
    token.value = null
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)

    // Limpar todos os stores ao logout
    const roadmapStore = useRoadmapStore()
    const dailyLogStore = useDailyLogStore()
    const teacherRankingStore = useTeacherRankingStore()

    roadmapStore.clearRoadmaps()
    dailyLogStore.clearLogs()
    teacherRankingStore.clearTeachers()
    syncManager.clearQueue()
  }

  function hasPendingChanges(): boolean {
    return syncManager.hasPendingChanges()
  }

  function getAuthHeaders() {
    if (!token.value) return {}
    return { Authorization: `Bearer ${token.value}` }
  }

  return {
    hasAccount,
    isLoggedIn,
    username,
    user,
    token,
    init,
    register,
    login,
    logout,
    getAuthHeaders,
    hasPendingChanges
  }
})

