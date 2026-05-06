<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { useRoadmapStore } from '@/stores/roadmap'
import { useDailyLogStore } from '@/stores/dailyLog'

const settingsStore = useSettingsStore()
const roadmapStore = useRoadmapStore()
const dailyLogStore = useDailyLogStore()

function exportJSON() {
  const data = {
    roadmaps: roadmapStore.roadmaps,
    dailyLogs: dailyLogStore.logs,
    settings: settingsStore.settings,
    exportedAt: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `roadmap-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importJSON(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.roadmaps) roadmapStore.roadmaps = data.roadmaps
      if (data.dailyLogs) dailyLogStore.logs = data.dailyLogs
      if (data.settings) settingsStore.updateSettings(data.settings)
      alert('Dados importados com sucesso!')
    } catch (error) {
      alert('Erro ao importar JSON: ' + error)
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 p-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Configurações</h1>

      <div class="space-y-6">
        <!-- Tema -->
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Tema</h3>
          <button
            @click="settingsStore.toggleTheme"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Atual: {{ settingsStore.settings.theme }} (Alternar)
          </button>
        </div>

        <!-- Metas -->
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Metas Diárias</h3>
          <div class="space-y-3">
            <label class="block">
              <span class="text-gray-700 dark:text-gray-300">Minutos de estudo</span>
              <input
                v-model.number="settingsStore.settings.dailyGoalMinutes"
                type="number"
                class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </label>
            <label class="block">
              <span class="text-gray-700 dark:text-gray-300">Questões a resolver</span>
              <input
                v-model.number="settingsStore.settings.dailyGoalQuestoes"
                type="number"
                class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </label>
          </div>
        </div>

        <!-- Backup/Restauração -->
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Backup e Restauração</h3>
          <div class="flex gap-2">
            <button
              @click="exportJSON"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex-1"
            >
              📥 Exportar JSON
            </button>
            <label class="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded cursor-pointer">
              📤 Importar JSON
              <input
                type="file"
                accept=".json"
                @change="importJSON"
                class="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
