<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDailyLogStore } from '@/stores/dailyLog'
import DailyLogEntry from '@/components/molecules/DailyLogEntry.vue'
import AppButton from '@/components/atoms/AppButton.vue'

const dailyLogStore = useDailyLogStore()

onMounted(() => {
  dailyLogStore.initLogs()
})

const editingDate = ref<string | null>(null)
const formData = ref({
  date: dailyLogStore.today,
  fiz: '',
  minutosEstudados: 0,
  questoesFeitas: 0,
  mood: 3
})

const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const monthsShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const heatmapData = computed(() => {
  const data: { [date: string]: number } = {}
  dailyLogStore.logs.forEach(log => {
    data[log.date] = log.minutosEstudados || 0
  })
  return data
})

const monthsHeatmap = computed(() => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const monthsData = []

  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(currentYear, m + 1, 0).getDate()
    const days = []

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, m, d)
      const dateStr = `${currentYear}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const activity = heatmapData.value[dateStr] || 0

      days.push({
        date: dateStr,
        day: d,
        dayOfWeek: date.getDay(),
        activity
      })
    }

    monthsData.push({
      month: m,
      monthName: months[m],
      monthNameShort: monthsShort[m],
      days
    })
  }

  return monthsData
})

const getIntensityClass = (activity: number) => {
  if (activity === 0) return 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
  if (activity < 30) return 'bg-emerald-200 dark:bg-emerald-800 border border-emerald-300 dark:border-emerald-700'
  if (activity < 60) return 'bg-emerald-400 dark:bg-emerald-600 border border-emerald-500 dark:border-emerald-500'
  if (activity < 120) return 'bg-emerald-500 dark:bg-emerald-500 border border-emerald-600 dark:border-emerald-400'
  return 'bg-emerald-700 dark:bg-emerald-400 border border-emerald-800 dark:border-emerald-300'
}

const formatDateBR = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

const startEditingDate = (date: string) => {
  editingDate.value = date
  const log = dailyLogStore.logs.find(l => l.date === date)
  if (log) {
    formData.value = {
      date: log.date,
      fiz: log.fiz,
      minutosEstudados: log.minutosEstudados,
      questoesFeitas: log.questoesFeitas,
      mood: log.mood
    }
  } else {
    formData.value = {
      date: date,
      fiz: '',
      minutosEstudados: 0,
      questoesFeitas: 0,
      mood: 3
    }
  }
}

const startEditingToday = () => {
  startEditingDate(dailyLogStore.today)
}

const submitForm = async () => {
  await dailyLogStore.saveLog({
    id: `log-${formData.value.date}`,
    date: formData.value.date,
    fiz: formData.value.fiz,
    fareiAmanha: '',
    topicsWorkedOn: [],
    minutosEstudados: formData.value.minutosEstudados,
    questoesFeitas: formData.value.questoesFeitas,
    mood: formData.value.mood
  })
  editingDate.value = null
}

const cancelEdit = () => {
  editingDate.value = null
}

</script>

<template>
  <div class="space-y-8">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <button @click="$router.push('/')" class="text-blue-600 dark:text-blue-400 hover:underline">
        Início
      </button>
      <span>•</span>
      <span class="font-medium text-gray-900 dark:text-white">Registros Diários</span>
    </div>

    <!-- Header -->
    <div class="space-y-4 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Registros Diários</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Acompanhe sua atividade de estudo ao longo do ano
      </p>
    </div>

    <!-- Activity Heatmap -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Atividade do Ano</h2>
      </div>

      <!-- Legend -->
      <div class="mb-6 flex items-center gap-4 text-xs">
        <span class="text-gray-600 dark:text-gray-400 font-medium">Menos</span>
        <div class="flex gap-1.5">
          <div class="w-3 h-3 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm" title="Sem atividade"></div>
          <div class="w-3 h-3 bg-emerald-200 dark:bg-emerald-800 border border-emerald-300 dark:border-emerald-700 rounded-sm" title="Até 30 min"></div>
          <div class="w-3 h-3 bg-emerald-400 dark:bg-emerald-600 border border-emerald-500 dark:border-emerald-500 rounded-sm" title="30-60 min"></div>
          <div class="w-3 h-3 bg-emerald-500 dark:bg-emerald-500 border border-emerald-600 dark:border-emerald-400 rounded-sm" title="60-120 min"></div>
          <div class="w-3 h-3 bg-emerald-700 dark:bg-emerald-400 border border-emerald-800 dark:border-emerald-300 rounded-sm" title="120+ min"></div>
        </div>
        <span class="text-gray-600 dark:text-gray-400 font-medium">Mais</span>
      </div>

      <!-- Months Heatmap (Horizontal - GitHub style with scroll) -->
      <div class="overflow-x-auto pb-4 -mx-6 px-6">
        <div class="flex gap-6 min-w-min">
          <div v-for="monthData in monthsHeatmap" :key="monthData.month" class="flex-shrink-0 space-y-2">
            <!-- Month name -->
            <h3 class="text-xs font-semibold text-gray-900 dark:text-white mb-3">{{ monthData.monthNameShort }}</h3>

            <!-- Month Heatmap Grid (7 days × weeks) -->
            <div class="inline-grid gap-2" style="grid-template-columns: repeat(7, minmax(0, 1fr));">
              <!-- Day headers -->
              <div v-for="dayName in ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']" :key="dayName" class="w-6 h-6 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                {{ dayName }}
              </div>

              <!-- Empty cells for days before month starts -->
              <template v-for="i in monthData.days[0]?.dayOfWeek || 0" :key="`empty-${i}`">
                <div class="w-6 h-6"></div>
              </template>

              <!-- Day cells -->
              <button
                v-for="day in monthData.days"
                :key="day.date"
                :class="['w-6 h-6 rounded-sm text-xs transition-all cursor-pointer hover:scale-110', getIntensityClass(day.activity)]"
                :title="`${formatDateBR(day.date)}: ${day.activity} min`"
                @click="startEditingDate(day.date)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Log Form or View -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div v-if="editingDate === null">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Registro de Hoje</h2>
        <div v-if="dailyLogStore.todayLog">
          <DailyLogEntry :entry="dailyLogStore.todayLog" />
          <AppButton
            variant="ghost"
            size="sm"
            @click="startEditingToday"
            class="mt-3"
          >
            Editar
          </AppButton>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400 mb-4">Você ainda não registrou nada hoje</p>
          <AppButton
            variant="primary"
            @click="startEditingToday"
          >
            Criar Registro de Hoje
          </AppButton>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-else class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Editar Registro - {{ editingDate ? formatDateBR(editingDate) : '' }}</h2>

        <!-- What I did -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">O que você estudou?</label>
          <textarea
            v-model="formData.fiz"
            rows="4"
            placeholder="Descreva o que estudou hoje..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <!-- Minutes Studied -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minutos Estudados: {{ formData.minutosEstudados }}
            </label>
            <input
              v-model.number="formData.minutosEstudados"
              type="range"
              min="0"
              max="480"
              step="15"
              class="w-full"
            />
          </div>

          <!-- Questions Done -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Questões Feitas: {{ formData.questoesFeitas }}
            </label>
            <input
              v-model.number="formData.questoesFeitas"
              type="range"
              min="0"
              max="100"
              step="5"
              class="w-full"
            />
          </div>
        </div>

        <!-- Mood -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Como você se sentiu? {{ formData.mood }}/5
          </label>
          <div class="flex gap-2">
            <button
              v-for="mood in [1, 2, 3, 4, 5]"
              :key="mood"
              @click="formData.mood = mood"
              :class="[
                'w-10 h-10 rounded-lg font-semibold transition-all',
                formData.mood === mood
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ mood }}
            </button>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <AppButton variant="primary" @click="submitForm">
            Salvar
          </AppButton>
          <AppButton variant="ghost" @click="cancelEdit">
            Cancelar
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Last 7 Days -->
    <div v-if="dailyLogStore.last7Days.length > 0" class="space-y-4">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Últimos 7 Dias</h2>
      <div class="space-y-2">
        <DailyLogEntry
          v-for="log in dailyLogStore.last7Days"
          :key="log.id"
          :entry="log"
          :compact="false"
        />
      </div>
    </div>
  </div>
</template>
