import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { DailyLogEntry } from '@/types'

const STORAGE_KEY = 'concursos-portugues-daily-logs-v1'

function generateId() {
  return Math.random().toString(36).substring(2, 11)
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const useDailyLogStore = defineStore('dailyLog', () => {
  const logs = ref<DailyLogEntry[]>([])

  function initLogs() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        logs.value = JSON.parse(stored)
      } catch {
        logs.value = []
      }
    }
  }

  const today = computed(() => formatDate(new Date()))

  const todayLog = computed((): DailyLogEntry | null => {
    return logs.value.find(log => log.date === today.value) || null
  })

  const last7Days = computed(() => {
    const sorted = [...logs.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return sorted.slice(0, 7)
  })

  const streakDays = computed(() => {
    if (logs.value.length === 0) return 0

    const sorted = [...logs.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let streak = 0
    let currentDate = new Date()

    for (const log of sorted) {
      const logDate = new Date(log.date)
      const expectedDate = new Date(currentDate)
      expectedDate.setDate(expectedDate.getDate() - streak)

      if (formatDate(logDate) === formatDate(expectedDate)) {
        streak++
      } else {
        break
      }
    }

    return streak
  })

  function saveLog(entry: DailyLogEntry) {
    const existingIndex = logs.value.findIndex(log => log.date === entry.date)
    if (existingIndex >= 0) {
      logs.value[existingIndex] = entry
    } else {
      logs.value.push(entry)
    }
  }

  function updateTodayLog(partial: Partial<DailyLogEntry>) {
    const existing = todayLog.value
    if (existing) {
      Object.assign(existing, partial)
    } else {
      const newLog: DailyLogEntry = {
        id: generateId(),
        date: today.value,
        fiz: '',
        fareiAmanha: '',
        topicsWorkedOn: [],
        minutosEstudados: 0,
        questoesFeitas: 0,
        mood: 3,
        ...partial
      }
      logs.value.push(newLog)
    }
  }

  function deleteLog(id: string) {
    logs.value = logs.value.filter(log => log.id !== id)
  }

  function persistToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.value))
  }

  watch(() => logs.value, persistToStorage, { deep: true })

  return {
    logs,
    today,
    todayLog,
    last7Days,
    streakDays,
    initLogs,
    saveLog,
    updateTodayLog,
    deleteLog,
    persistToStorage
  }
})
