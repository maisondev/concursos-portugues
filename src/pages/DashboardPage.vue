<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useSettingsStore } from '@/stores/settings'
import { useTeacherRankingStore } from '@/stores/teacherRanking'
import ProgressDashboard from '@/components/organisms/ProgressDashboard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import AppIcon from '@/components/atoms/AppIcon.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const progressStore = useProgressStore()
const dailyLogStore = useDailyLogStore()
const settingsStore = useSettingsStore()
const teacherRankingStore = useTeacherRankingStore()

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
  teacherRankingStore.init()
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
              <div class="flex items-center gap-2">
                <AppButton variant="ghost" size="sm" @click="startEditEntry(entry)" title="Editar">
                  <PencilIcon class="w-4 h-4" />
                </AppButton>
                <AppButton variant="danger" size="sm" @click="deleteRankingEntry(entry.id)" title="Remover">
                  <TrashIcon class="w-4 h-4" />
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
