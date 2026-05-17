<script setup lang="ts">
import type { ProgressSnapshot, DailyLogEntry } from '@/types'
import { ChartBarIcon, FireIcon, QuestionMarkCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import StatBadge from '@/components/molecules/StatBadge.vue'
import AppProgressBar from '@/components/atoms/AppProgressBar.vue'

interface Props {
  snapshot: ProgressSnapshot
  logs: DailyLogEntry[]
}

defineProps<Props>()

const getProgressColor = (percent: number): 'red' | 'yellow' | 'green' => {
  if (percent < 33) return 'red'
  if (percent < 66) return 'yellow'
  return 'green'
}

const getTodayMinutes = (logs: DailyLogEntry[]): number => {
  const today = new Date().toISOString().split('T')[0]
  const todayLog = logs.find(log => log.date === today)
  return todayLog?.minutosEstudados || 0
}
</script>

<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatBadge
        label="Progresso Geral"
        :value="`${Math.round((snapshot.completedTopics / snapshot.totalTopics) * 100)}%`"
        :icon="ChartBarIcon"
        :color="getProgressColor((snapshot.completedTopics / snapshot.totalTopics) * 100)"
      />
      <StatBadge
        label="Sequência"
        :value="snapshot.streakDays"
        :icon="FireIcon"
        color="purple"
      />
      <StatBadge
        label="Questões Feitas"
        :value="snapshot.totalQuestoes"
        :icon="QuestionMarkCircleIcon"
        color="blue"
      />
      <StatBadge
        label="Acerto Médio"
        :value="snapshot.avgAcerto ? `${Math.round(snapshot.avgAcerto)}%` : 'N/A'"
        :icon="CheckCircleIcon"
        color="green"
      />
    </div>

    <!-- Overall Progress -->
    <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Progresso Geral</p>
      <AppProgressBar
        :value="Math.round((snapshot.completedTopics / snapshot.totalTopics) * 100)"
        :color="getProgressColor((snapshot.completedTopics / snapshot.totalTopics) * 100)"
        show-label
      />
      <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">
        {{ snapshot.completedTopics }} de {{ snapshot.totalTopics }} tópicos concluídos
      </p>
    </div>

  </div>
</template>
