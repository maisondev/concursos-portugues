import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppSettings } from '@/types'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const LOCAL_STORAGE_KEY = 'roadmap-settings-local-v1'

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'pt-BR',
  dailyGoalMinutes: 60,
  dailyGoalQuestoes: 10,
  showStreak: true,
  markViewedOnOpen: true,
  deletePassword: '1234'
}

function getLocalSettings(): Partial<AppSettings> {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return {}
    }
  }
  return {}
}

function saveLocalSettings(local: Partial<AppSettings>) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local))
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function initSettings() {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null

    try {
      // Carregar settings locais (tema, idioma, deletePassword)
      const localSettings = getLocalSettings()
      settings.value = { ...DEFAULT_SETTINGS, ...localSettings }

      // Se logado, carregar settings da API
      if (authStore.isLoggedIn) {
        const apiSettings = await api.get('/api/settings')
        settings.value = {
          ...settings.value,
          theme: apiSettings.theme || settings.value.theme,
          dailyGoalMinutes: apiSettings.dailyGoalMinutes || settings.value.dailyGoalMinutes,
          dailyGoalQuestoes: apiSettings.dailyGoalQuestions || settings.value.dailyGoalQuestoes
        }
      }

      applyTheme()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar configurações'
      console.error('Erro ao inicializar settings:', err)
    } finally {
      isLoading.value = false
    }
  }

  function applyTheme() {
    const html = document.documentElement
    if (settings.value.theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  function updateSettings(partial: Partial<AppSettings>) {
    settings.value = { ...settings.value, ...partial }

    // Salvar settings locais
    const localSettings = {
      language: settings.value.language,
      deletePassword: settings.value.deletePassword,
      showStreak: settings.value.showStreak,
      markViewedOnOpen: settings.value.markViewedOnOpen
    }
    saveLocalSettings(localSettings)

    if (partial.theme) {
      applyTheme()
    }
  }

  function toggleTheme() {
    settings.value.theme = settings.value.theme === 'dark' ? 'light' : 'dark'
    applyTheme()

    const localSettings = {
      language: settings.value.language,
      deletePassword: settings.value.deletePassword,
      showStreak: settings.value.showStreak,
      markViewedOnOpen: settings.value.markViewedOnOpen,
      theme: settings.value.theme
    }
    saveLocalSettings(localSettings)
  }

  return {
    settings,
    isLoading,
    error,
    initSettings,
    updateSettings,
    toggleTheme
  }
})
