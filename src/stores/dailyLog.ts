import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DailyLogEntry } from '@/types'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const useDailyLogStore = defineStore('dailyLog', () => {
  const logs = ref<DailyLogEntry[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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

  async function initLogs() {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn) {
      logs.value = []
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await api.get('/api/logs')
      logs.value = (data || []).map((log: any) => ({
        id: log.id,
        date: log.date,
        fiz: log.text || '',
        fareiAmanha: '',
        topicsWorkedOn: [],
        minutosEstudados: log.minutes || 0,
        questoesFeitas: log.questions || 0,
        mood: log.mood || 3
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar logs'
      console.error('Erro ao inicializar logs:', err)
      logs.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function saveLog(entry: DailyLogEntry) {
    const authStore = useAuthStore()

    // Salvar localmente
    const existingIndex = logs.value.findIndex(log => log.date === entry.date)
    if (existingIndex >= 0) {
      logs.value[existingIndex] = entry
    } else {
      logs.value.push(entry)
    }

    // Salvar no banco se logado
    if (authStore.isLoggedIn) {
      try {
        await api.post('/api/logs', {
          date: entry.date,
          text: entry.fiz,
          minutes: entry.minutosEstudados,
          questions: entry.questoesFeitas,
          mood: entry.mood
        })
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Erro ao salvar log'
        console.error('Erro ao salvar log:', err)
      }
    }
  }

  function updateTodayLog(partial: Partial<DailyLogEntry>) {
    const existing = todayLog.value
    if (existing) {
      Object.assign(existing, partial)
    } else {
      const newLog: DailyLogEntry = {
        id: `log-${Date.now()}`,
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

  async function deleteLog(id: string) {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn) {
      logs.value = logs.value.filter(log => log.id !== id)
      return
    }

    try {
      await api.delete(`/api/logs/${id}`)
      logs.value = logs.value.filter(log => log.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao deletar log'
      console.error('Erro ao deletar log:', err)
    }
  }

  function clearLogs() {
    logs.value = []
  }

  return {
    logs,
    today,
    todayLog,
    last7Days,
    streakDays,
    isLoading,
    error,
    initLogs,
    saveLog,
    updateTodayLog,
    deleteLog,
    clearLogs
  }
})
