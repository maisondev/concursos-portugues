<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useSettingsStore } from '@/stores/settings'
import ProgressDashboard from '@/components/organisms/ProgressDashboard.vue'
import DailyLogEntry from '@/components/molecules/DailyLogEntry.vue'
import AppButton from '@/components/atoms/AppButton.vue'

const progressStore = useProgressStore()
const dailyLogStore = useDailyLogStore()
const settingsStore = useSettingsStore()

const fiz = ref('')
const fareiAmanha = ref('')
const minutosEstudados = ref(0)
const questoesFeitas = ref(0)
const mood = ref(3)

onMounted(() => {
  dailyLogStore.initLogs()
  if (dailyLogStore.todayLog) {
    fiz.value = dailyLogStore.todayLog.fiz
    fareiAmanha.value = dailyLogStore.todayLog.fareiAmanha
    minutosEstudados.value = dailyLogStore.todayLog.minutosEstudados
    questoesFeitas.value = dailyLogStore.todayLog.questoesFeitas
    mood.value = dailyLogStore.todayLog.mood
  }
})

function saveLog() {
  dailyLogStore.updateTodayLog({
    fiz: fiz.value,
    fareiAmanha: fareiAmanha.value,
    minutosEstudados: minutosEstudados.value,
    questoesFeitas: questoesFeitas.value,
    mood: mood.value
  })
  alert('Registro salvo! 🎉')
}

const remainingMinutes = computed(() => {
  return Math.max(0, settingsStore.settings.dailyGoalMinutes - minutosEstudados.value)
})

const remainingQuestoes = computed(() => {
  return Math.max(0, settingsStore.settings.dailyGoalQuestoes - questoesFeitas.value)
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-4xl mx-auto p-4 space-y-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard de Progresso</h1>

      <!-- Progress Overview -->
      <ProgressDashboard
        :snapshot="progressStore.snapshotInterpretacao"
        :logs="dailyLogStore.logs"
      />

      <!-- Daily Log Form -->
      <div class="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Registro de Hoje</h2>

        <div class="space-y-4">
          <!-- Mood Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Como você se sente? {{ ['😢', '😟', '😐', '🙂', '😄'][mood - 1] }}
            </label>
            <div class="flex gap-3">
              <button
                v-for="m in [1, 2, 3, 4, 5]"
                :key="m"
                @click="mood = m"
                :class="[
                  'text-3xl px-3 py-2 rounded transition-transform',
                  mood === m ? 'scale-125 ring-2 ring-blue-500' : 'opacity-50 hover:opacity-100'
                ]"
              >
                {{ ['😢', '😟', '😐', '🙂', '😄'][m - 1] }}
              </button>
            </div>
          </div>

          <!-- Fiz -->
          <label class="block">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">O que fiz hoje?</span>
            <textarea
              v-model="fiz"
              rows="3"
              class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Ex: Estudei coesão textual, fiz 15 questões de FGV..."
            />
          </label>

          <!-- Farei Amanhã -->
          <label class="block">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Vou fazer amanhã?</span>
            <textarea
              v-model="fareiAmanha"
              rows="3"
              class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Ex: Funções da linguagem + 20 questões..."
            />
          </label>

          <!-- Metrics -->
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Minutos estudados (meta: {{ settingsStore.settings.dailyGoalMinutes }}min)
              </span>
              <input
                v-model.number="minutosEstudados"
                type="number"
                class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Faltam: {{ remainingMinutes }}min
              </p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Questões feitas (meta: {{ settingsStore.settings.dailyGoalQuestoes }})
              </span>
              <input
                v-model.number="questoesFeitas"
                type="number"
                class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Faltam: {{ remainingQuestoes }} questões
              </p>
            </label>
          </div>

          <AppButton variant="primary" size="lg" @click="saveLog" class="w-full">
            💾 Salvar Registro
          </AppButton>
        </div>
      </div>

      <!-- Recent Logs -->
      <div v-if="dailyLogStore.logs.length > 0" class="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Últimos Registros</h2>
        <div class="space-y-2">
          <DailyLogEntry
            v-for="log in dailyLogStore.last7Days"
            :key="log.id"
            :entry="log"
            :compact="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
