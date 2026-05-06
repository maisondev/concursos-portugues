import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { AppSettings } from '@/types'

const STORAGE_KEY = 'concursos-portugues-settings-v1'

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'pt-BR',
  dailyGoalMinutes: 60,
  dailyGoalQuestoes: 10,
  showStreak: true,
  deletePassword: '1234'
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS })

  function initSettings() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        settings.value = JSON.parse(stored)
        applyTheme()
      } catch {
        settings.value = { ...DEFAULT_SETTINGS }
      }
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
    if (partial.theme) {
      applyTheme()
    }
  }

  function toggleTheme() {
    settings.value.theme = settings.value.theme === 'dark' ? 'light' : 'dark'
    applyTheme()
  }

  function persistToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
  }

  watch(() => settings.value, persistToStorage, { deep: true })

  return {
    settings,
    initSettings,
    updateSettings,
    toggleTheme,
    persistToStorage
  }
})
