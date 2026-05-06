<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'
import { useDailyLogStore } from '@/stores/dailyLog'

const progressStore = useProgressStore()
const dailyLogStore = useDailyLogStore()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p class="text-sm text-gray-600 dark:text-gray-400">Progresso Geral</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ progressStore.overallPercent }}%
          </p>
        </div>

        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p class="text-sm text-gray-600 dark:text-gray-400">Streak 🔥</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ dailyLogStore.streakDays }}
          </p>
        </div>

        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p class="text-sm text-gray-600 dark:text-gray-400">Questões Feitas</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ progressStore.snapshotInterpretacao.totalQuestoes }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
