import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useRoadmapStore } from './roadmap'
import { useDailyLogStore } from './dailyLog'
import type { ProgressSnapshot } from '@/types'

export const useProgressStore = defineStore('progress', () => {
  const roadmapStore = useRoadmapStore()
  const dailyLogStore = useDailyLogStore()

  function recomputeSnapshot(roadmapId: string): ProgressSnapshot {
    const roadmap = roadmapStore.roadmaps[roadmapId]
    if (!roadmap) {
      return {
        roadmapId,
        totalTopics: 0,
        completedTopics: 0,
        inProgressTopics: 0,
        totalQuestoes: 0,
        avgAcerto: null,
        streakDays: 0,
        lastStudiedDate: null
      }
    }

    let totalTopics = 0
    let completedTopics = 0
    let inProgressTopics = 0
    let totalQuestoes = 0
    let totalAcerto = 0
    let acertoCount = 0

    roadmap.blocks.forEach(block => {
      block.topics.forEach(topic => {
        totalTopics++
        if (topic.status === 'concluido') completedTopics++
        if (topic.status === 'em_andamento') inProgressTopics++
        totalQuestoes += topic.questoesSolvidas
        if (topic.acertoPercent !== null) {
          totalAcerto += topic.acertoPercent
          acertoCount++
        }
      })
    })

    const avgAcerto = acertoCount > 0 ? totalAcerto / acertoCount : null
    const lastLog = dailyLogStore.last7Days[0]
    const lastStudiedDate = lastLog ? lastLog.date : null
    const streakDays = dailyLogStore.streakDays

    return {
      roadmapId,
      totalTopics,
      completedTopics,
      inProgressTopics,
      totalQuestoes,
      avgAcerto,
      streakDays,
      lastStudiedDate
    }
  }

  const snapshotInterpretacao = computed(() => {
    // Se existir roadmap com ID específico, usar esse, senão buscar o primeiro ou geral
    const firstRoadmapId = Object.keys(roadmapStore.roadmaps)[0]
    return recomputeSnapshot(firstRoadmapId || 'default')
  })

  function blockProgressPercent(blockId: string): number {
    const block = roadmapStore.blockById(blockId)
    if (!block || block.topics.length === 0) return 0
    const completed = block.topics.filter(t => t.status === 'concluido').length
    return Math.round((completed / block.topics.length) * 100)
  }

  const overallPercent = computed(() => {
    const snapshot = snapshotInterpretacao.value
    if (snapshot.totalTopics === 0) return 0
    return Math.round((snapshot.completedTopics / snapshot.totalTopics) * 100)
  })

  function roadmapProgressPercent(roadmapId: string): number {
    const snapshot = recomputeSnapshot(roadmapId)
    if (snapshot.totalTopics === 0) return 0
    return Math.round((snapshot.completedTopics / snapshot.totalTopics) * 100)
  }

  return {
    recomputeSnapshot,
    snapshotInterpretacao,
    blockProgressPercent,
    overallPercent,
    roadmapProgressPercent
  }
})
