import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

type AuthStorage = {
  version: 1
  user?: {
    username: string
    saltB64: string
    hashB64: string
    iterations: number
    createdAt: string
  }
  session?: {
    username: string
    token: string
    createdAt: string
  }
}

const STORAGE_KEY = 'concursos-portugues-auth-v1'
const SESSION_KEY = 'concursos-portugues-auth-session-v1'

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
  const storage = ref<AuthStorage>({ version: 1 })
  const session = ref<AuthStorage['session'] | null>(null)

  const hasAccount = computed(() => Boolean(storage.value.user))
  const isLoggedIn = computed(() => Boolean(session.value?.token))
  const username = computed(() => session.value?.username || storage.value.user?.username || null)

  function init() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        storage.value = JSON.parse(stored)
      } catch {
        storage.value = { version: 1 }
      }
    }

    const sessionStored = sessionStorage.getItem(SESSION_KEY)
    if (sessionStored) {
      try {
        session.value = JSON.parse(sessionStored)
      } catch {
        session.value = null
      }
    }
  }

  async function register(usernameInput: string, password: string) {
    const usernameClean = usernameInput.trim()
    if (!usernameClean) throw new Error('Digite um nome de usuário')
    if (password.length < 6) throw new Error('A senha deve ter no mínimo 6 caracteres')

    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iterations = 150_000
    const hash = await pbkdf2Hash(password, salt, iterations)

    storage.value.user = {
      username: usernameClean,
      saltB64: toB64(salt.buffer),
      hashB64: toB64(hash),
      iterations,
      createdAt: new Date().toISOString()
    }

    // login automático após cadastro
    session.value = {
      username: usernameClean,
      token: randomToken(),
      createdAt: new Date().toISOString()
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session.value))
  }

  async function login(password: string) {
    const user = storage.value.user
    if (!user) throw new Error('Nenhuma conta cadastrada neste dispositivo')
    const salt = fromB64(user.saltB64)
    const hash = await pbkdf2Hash(password, salt, user.iterations)
    const hashB64 = toB64(hash)
    if (hashB64 !== user.hashB64) throw new Error('Senha incorreta')

    session.value = {
      username: user.username,
      token: randomToken(),
      createdAt: new Date().toISOString()
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session.value))
  }

  function logout() {
    session.value = null
    sessionStorage.removeItem(SESSION_KEY)
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage.value))
  }

  watch(() => storage.value, persist, { deep: true })

  return {
    hasAccount,
    isLoggedIn,
    username,
    init,
    register,
    login,
    logout
  }
})

