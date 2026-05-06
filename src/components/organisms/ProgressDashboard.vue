<script setup lang="ts">
import type { ProgressSnapshot, DailyLogEntry } from '@/types'
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

const getLast7Days = (logs: DailyLogEntry[]) => {
  const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return sorted.slice(0, 7).reverse()
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
        icon="📊"
        :color="getProgressColor((snapshot.completedTopics / snapshot.totalTopics) * 100)"
      />
      <StatBadge
        label="Streak 🔥"
        :value="snapshot.streakDays"
        icon="🔥"
        color="purple"
      />
      <StatBadge
        label="Questões Feitas"
        :value="snapshot.totalQuestoes"
        icon="❓"
        color="blue"
      />
      <StatBadge
        label="Acerto Médio"
        :value="snapshot.avgAcerto ? `${Math.round(snapshot.avgAcerto)}%` : 'N/A'"
        icon="✅"
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

    <!-- Last 7 Days -->
    <div v-if="logs.length > 0" class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Últimos 7 Dias</p>
      <div class="flex items-end justify-around h-24 gap-1">
        <div
          v-for="log in getLast7Days(logs)"
          :key="log.id"
          class="flex-1 flex flex-col items-center"
        >
          <div
            :style="{ height: `${Math.min((log.minutosEstudados / 120) * 100, 100)}%` }"
            class="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
            :title="`${log.minutosEstudados} min`"
          />
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {{ new Date(log.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit' }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
