<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useSettingsStore } from '@/stores/settings'
import { useTeacherRankingStore } from '@/stores/teacherRanking'
import ProgressDashboard from '@/components/organisms/ProgressDashboard.vue'
import DailyLogEntry from '@/components/molecules/DailyLogEntry.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const progressStore = useProgressStore()
const dailyLogStore = useDailyLogStore()
const settingsStore = useSettingsStore()
const teacherRankingStore = useTeacherRankingStore()

const fiz = ref('')
const fareiAmanha = ref('')
const minutosEstudados = ref(0)
const questoesFeitas = ref(0)
const mood = ref(3)
const showLogModal = ref(false)

const teacherName = ref('')
const discipline = ref('')
const score = ref(5)
const rankingNotes = ref('')
const filterDiscipline = ref('all')

// Edit state
const editingEntryId = ref<string | null>(null)
const editTeacherName = ref('')
const editDiscipline = ref('')
const editScore = ref(5)
const editRankingNotes = ref('')

onMounted(() => {
  dailyLogStore.initLogs()
  teacherRankingStore.init()
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
  showLogModal.value = false
}

const remainingMinutes = computed(() => {
  return Math.max(0, settingsStore.settings.dailyGoalMinutes - minutosEstudados.value)
})

const remainingQuestoes = computed(() => {
  return Math.max(0, settingsStore.settings.dailyGoalQuestoes - questoesFeitas.value)
})

const filteredRanking = computed(() => {
  const list = teacherRankingStore.entries
  if (filterDiscipline.value === 'all') return [...list].sort((a, b) => b.score - a.score)
  return [...list].filter(e => e.discipline === filterDiscipline.value).sort((a, b) => b.score - a.score)
})

function addRankingEntry() {
  if (!teacherName.value.trim() || !discipline.value.trim()) {
    alert('Preencha professor e disciplina')
    return
  }
  teacherRankingStore.addEntry({
    teacherName: teacherName.value.trim(),
    discipline: discipline.value.trim(),
    score: score.value,
    notes: rankingNotes.value.trim() || undefined
  })
  teacherName.value = ''
  discipline.value = ''
  score.value = 5
  rankingNotes.value = ''
}

function deleteRankingEntry(id: string) {
  teacherRankingStore.deleteEntry(id)
}

function startEditEntry(entry: any) {
  editingEntryId.value = entry.id
  editTeacherName.value = entry.teacherName
  editDiscipline.value = entry.discipline
  editScore.value = entry.score
  editRankingNotes.value = entry.notes || ''
}

function saveEditEntry() {
  if (!editingEntryId.value || !editTeacherName.value.trim() || !editDiscipline.value.trim()) {
    alert('Preencha professor e disciplina')
    return
  }
  teacherRankingStore.updateEntry(editingEntryId.value, {
    teacherName: editTeacherName.value.trim(),
    discipline: editDiscipline.value.trim(),
    score: editScore.value,
    notes: editRankingNotes.value.trim() || undefined
  })
  cancelEdit()
}

function cancelEdit() {
  editingEntryId.value = null
  editTeacherName.value = ''
  editDiscipline.value = ''
  editScore.value = 5
  editRankingNotes.value = ''
}
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

      <!-- Daily Log -->
      <div class="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Registro de Hoje</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Preencha seu registro diário para acompanhar consistência e metas.
          </p>
        </div>
        <AppButton variant="primary" size="sm" @click="showLogModal = true">
          {{ dailyLogStore.todayLog ? 'Editar' : 'Criar' }}
        </AppButton>
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

      <!-- Teacher ranking -->
      <div class="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Ranking de Professores</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Avalie professores por disciplina (salvo neste navegador).</p>
          </div>
          <div class="min-w-[12rem]">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Disciplina</label>
            <select
              v-model="filterDiscipline"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="all">Todas</option>
              <option v-for="d in teacherRankingStore.disciplines" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div class="md:col-span-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Professor</label>
            <input
              v-model="teacherName"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Ex: Prof. João"
            />
          </div>
          <div class="md:col-span-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Disciplina</label>
            <input
              v-model="discipline"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Ex: Português"
            />
          </div>
          <div class="md:col-span-1">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nota (1-5)</label>
            <input
              v-model.number="score"
              type="number"
              min="1"
              max="5"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
          <div class="md:col-span-1 flex items-end">
            <AppButton variant="secondary" size="sm" class="w-full" @click="addRankingEntry">
              + Adicionar
            </AppButton>
          </div>
          <div class="md:col-span-4">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Observações (opcional)</label>
            <input
              v-model="rankingNotes"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Ex: ótimo em questões, didática clara..."
            />
          </div>
        </div>

        <div v-if="filteredRanking.length === 0" class="text-sm text-gray-600 dark:text-gray-400 text-center py-6">
          Nenhum professor cadastrado ainda.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="entry in filteredRanking"
            :key="entry.id"
            class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          >
            <!-- Edit mode -->
            <div v-if="editingEntryId === entry.id && editingEntryId !== null" class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div class="md:col-span-1">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Professor</label>
                  <input
                    v-model="editTeacherName"
                    type="text"
                    class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div class="md:col-span-1">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Disciplina</label>
                  <input
                    v-model="editDiscipline"
                    type="text"
                    class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div class="md:col-span-1">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nota (1-5)</label>
                  <input
                    v-model.number="editScore"
                    type="number"
                    min="1"
                    max="5"
                    class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div class="md:col-span-1 flex items-end gap-2">
                  <AppButton variant="secondary" size="sm" @click="saveEditEntry" class="flex-1">
                    Salvar
                  </AppButton>
                  <AppButton variant="ghost" size="sm" @click="cancelEdit">
                    Cancelar
                  </AppButton>
                </div>
                <div class="md:col-span-4">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Observações</label>
                  <input
                    v-model="editRankingNotes"
                    type="text"
                    class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <!-- View mode -->
            <div v-else class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="font-semibold text-gray-900 dark:text-white break-words">{{ entry.teacherName }}</p>
                  <span class="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    {{ entry.discipline }}
                  </span>
                  <span class="text-xs text-gray-600 dark:text-gray-400">{{ entry.score }}/5</span>
                </div>
                <p v-if="entry.notes" class="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">{{ entry.notes }}</p>
              </div>
              <div class="flex items-center gap-1 border border-blue-200 p-2 rounded relative z-10">
                <div @click="startEditEntry(entry)" title="Editar" class="cursor-pointer p-1 border border-blue-300 bg-white dark:bg-gray-800 rounded">
                  <PencilIcon class="w-4 h-4" />
                </div>
                <div @click="deleteRankingEntry(entry.id)" title="Remover" class="cursor-pointer p-1 border border-red-300 bg-white dark:bg-gray-800 rounded">
                  <TrashIcon class="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppModal
      :open="showLogModal"
      title="Registro de Hoje"
      submit-label="Salvar"
      cancel-label="Cancelar"
      @submit="saveLog"
      @cancel="showLogModal = false"
    >
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
              type="button"
            >
              {{ ['😢', '😟', '😐', '🙂', '😄'][m - 1] }}
            </button>
          </div>
        </div>

        <label class="block">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">O que fiz hoje?</span>
          <textarea
            v-model="fiz"
            rows="3"
            class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Ex: Estudei coesão textual, fiz 15 questões de FGV..."
          />
        </label>

        <label class="block">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Vou fazer amanhã?</span>
          <textarea
            v-model="fareiAmanha"
            rows="3"
            class="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Ex: Funções da linguagem + 20 questões..."
          />
        </label>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Minutos estudados (meta: {{ settingsStore.settings.dailyGoalMinutes }}min)
            </label>
            <input
              v-model.number="minutosEstudados"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Faltam: {{ remainingMinutes }}min
            </p>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Questões feitas (meta: {{ settingsStore.settings.dailyGoalQuestoes }})
            </label>
            <input
              v-model.number="questoesFeitas"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Faltam: {{ remainingQuestoes }} questões
            </p>
          </div>
        </div>
      </div>
    </AppModal>
  </div>
</template>
