import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

export interface TeacherRankingEntry {
  id: string
  teacherName: string
  discipline: string
  score: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export const useTeacherRankingStore = defineStore('teacherRanking', () => {
  const entries = ref<TeacherRankingEntry[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const disciplines = computed(() => {
    return Array.from(
      new Set(entries.value.map(e => e.discipline.trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b))
  })

  async function init() {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn) {
      entries.value = []
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await api.get('/api/teachers')
      entries.value = (data || []).map((teacher: any) => ({
        id: teacher.id,
        teacherName: teacher.name,
        discipline: teacher.subject,
        score: teacher.rating,
        notes: teacher.notes,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar professores'
      console.error('Erro ao inicializar teacher ranking:', err)
      entries.value = []
    } finally {
      isLoading.value = false
    }
  }

  function addEntry(input: Omit<TeacherRankingEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    entries.value.push({
      id: `teacher-${Date.now()}`,
      ...input,
      score: Math.max(1, Math.min(5, Math.round(input.score))),
      createdAt: now,
      updatedAt: now
    })
  }

  function updateEntry(id: string, updates: Partial<Omit<TeacherRankingEntry, 'id' | 'createdAt'>>) {
    const entry = entries.value.find(e => e.id === id)
    if (!entry) return
    Object.assign(entry, updates)
    entry.updatedAt = new Date().toISOString()
  }

  async function deleteEntry(id: string) {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn) {
      entries.value = entries.value.filter(e => e.id !== id)
      return
    }

    try {
      await api.delete(`/api/teachers/${id}`)
      entries.value = entries.value.filter(e => e.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao deletar professor'
      console.error('Erro ao deletar teacher:', err)
    }
  }

  function clearTeachers() {
    entries.value = []
  }

  return {
    entries,
    disciplines,
    isLoading,
    error,
    init,
    addEntry,
    updateEntry,
    deleteEntry,
    clearTeachers
  }
})
