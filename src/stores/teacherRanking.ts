import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export interface TeacherRankingEntry {
  id: string
  teacherName: string
  discipline: string
  score: number // 1-5
  notes?: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'concursos-portugues-teacher-ranking-v1'

function generateId() {
  return Math.random().toString(36).substring(2, 11)
}

export const useTeacherRankingStore = defineStore('teacherRanking', () => {
  const entries = ref<TeacherRankingEntry[]>([])

  function init() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        entries.value = JSON.parse(stored)
      } catch {
        entries.value = []
      }
    }
  }

  const disciplines = computed(() => {
    return Array.from(new Set(entries.value.map(e => e.discipline.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b))
  })

  function addEntry(input: Omit<TeacherRankingEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    entries.value.push({
      id: generateId(),
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

  function deleteEntry(id: string) {
    entries.value = entries.value.filter(e => e.id !== id)
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
  }

  watch(() => entries.value, persist, { deep: true })

  return {
    entries,
    disciplines,
    init,
    addEntry,
    updateEntry,
    deleteEntry
  }
})

