<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoadmapStore } from '@/stores/roadmap'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useProgressStore } from '@/stores/progress'
import { useSettingsStore } from '@/stores/settings'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import StatBadge from '@/components/molecules/StatBadge.vue'
import DailyLogEntry from '@/components/molecules/DailyLogEntry.vue'
import RoadmapCard from '@/components/molecules/RoadmapCard.vue'

const router = useRouter()
const roadmapStore = useRoadmapStore()
const dailyLogStore = useDailyLogStore()
const progressStore = useProgressStore()
const settingsStore = useSettingsStore()

const showAddRoadmapModal = ref(false)
const newRoadmapTitle = ref('')
const newRoadmapDescription = ref('')
const editingRoadmapId = ref<string | null>(null)

dailyLogStore.initLogs()

const roadmapIds = ref<string[]>([])

function initRoadmapOrder() {
  roadmapIds.value = Object.keys(roadmapStore.roadmaps).sort((a, b) => {
    const roadmapA = roadmapStore.roadmaps[a]
    const roadmapB = roadmapStore.roadmaps[b]
    return (roadmapA.order || 0) - (roadmapB.order || 0)
  })
}

function navigateToRoadmap(roadmapId: string) {
  roadmapStore.setActiveRoadmap(roadmapId)
  router.push({
    name: 'roadmap',
    params: { roadmapId }
  })
}

function createNewRoadmap() {
  if (!newRoadmapTitle.value.trim()) {
    alert('Digite um título para o roadmap')
    return
  }

  const id = roadmapStore.addRoadmap(newRoadmapTitle.value.trim(), newRoadmapDescription.value.trim())
  newRoadmapTitle.value = ''
  newRoadmapDescription.value = ''
  showAddRoadmapModal.value = false
  navigateToRoadmap(id)
}

function getRoadmapStats(roadmapId: string) {
  const roadmap = roadmapStore.roadmaps[roadmapId]
  if (!roadmap) return { blocks: 0, topics: 0, resources: 0, percent: 0 }

  let totalTopics = 0
  let completedTopics = 0
  let totalResources = 0

  roadmap.blocks.forEach(block => {
    totalTopics += block.topics.length
    completedTopics += block.topics.filter(t => t.status === 'concluido').length
    block.topics.forEach(topic => {
      totalResources += topic.resources.length
    })
  })

  return {
    blocks: roadmap.blocks.length,
    topics: totalTopics,
    resources: totalResources,
    percent: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
  }
}

function handleRoadmapEdit(roadmapId: string) {
  editingRoadmapId.value = roadmapId
}

function handleRoadmapDelete(roadmapId: string, password?: string) {
  if (!password) {
    return
  }

  if (password !== settingsStore.settings.deletePassword) {
    alert('Senha incorreta!')
    return
  }

  roadmapStore.removeRoadmap(roadmapId)
  initRoadmapOrder()
}

function handleRoadmapMoveUp(roadmapId: string) {
  roadmapStore.moveRoadmapUp(roadmapId)
  initRoadmapOrder()
}

function handleRoadmapMoveDown(roadmapId: string) {
  roadmapStore.moveRoadmapDown(roadmapId)
  initRoadmapOrder()
}

function handleRoadmapUpdateColor(roadmapId: string, color: string) {
  roadmapStore.updateRoadmapColor(roadmapId, color as any)
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-6xl mx-auto p-4 space-y-8">
      <!-- Header -->
      <div class="text-center py-8">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-3">
          Meus Roadmaps
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Crie e acompanhe múltiplos roadmaps de estudo
        </p>
      </div>

      <!-- Create Roadmap Button -->
      <div class="flex justify-end">
        <AppButton
          variant="primary"
          size="lg"
          @click="showAddRoadmapModal = true"
          class="flex items-center gap-2"
        >
          <AppIcon name="plus" size="sm" />
          Novo Roadmap
        </AppButton>
      </div>

      <!-- Roadmaps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RoadmapCard
          v-for="(id, idx) in Object.keys(roadmapStore.roadmaps)"
          :key="id"
          :roadmap="roadmapStore.roadmaps[id]"
          :roadmap-id="id"
          :stats="getRoadmapStats(id)"
          :can-move-up="idx > 0"
          :can-move-down="idx < Object.keys(roadmapStore.roadmaps).length - 1"
          @navigate="navigateToRoadmap(id)"
          @move-up="handleRoadmapMoveUp(id)"
          @move-down="handleRoadmapMoveDown(id)"
          @edit="handleRoadmapEdit(id)"
          @delete="(password) => handleRoadmapDelete(id, password)"
          @update-color="(color) => handleRoadmapUpdateColor(id, color)"
        />
      </div>

      <!-- Today's Log -->
      <div v-if="dailyLogStore.todayLog" class="p-6 border border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Você já registrou hoje!</h2>
        <DailyLogEntry :entry="dailyLogStore.todayLog" />
        <AppButton
          variant="ghost"
          size="sm"
          @click="router.push('/dashboard')"
          class="mt-3"
        >
          Editar registro →
        </AppButton>
      </div>

      <!-- Recent Activity -->
      <div v-if="dailyLogStore.last7Days.length > 0" class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Atividade Recente</h2>
        <div class="space-y-2">
          <DailyLogEntry
            v-for="log in dailyLogStore.last7Days.slice(0, 3)"
            :key="log.id"
            :entry="log"
            :compact="true"
          />
        </div>
      </div>

      <!-- Modal para criar novo roadmap -->
      <AppModal
        :open="showAddRoadmapModal"
        title="Criar Novo Roadmap"
        submit-label="Criar"
        cancel-label="Cancelar"
        @submit="createNewRoadmap"
        @cancel="showAddRoadmapModal = false"
      >
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título do Roadmap
            </label>
            <input
              v-model="newRoadmapTitle"
              type="text"
              placeholder="Ex: Gramática, Redação, Análise Combinatória"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              @keyup.enter="createNewRoadmap"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição (Opcional)
            </label>
            <textarea
              v-model="newRoadmapDescription"
              placeholder="Descreva o foco deste roadmap..."
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </AppModal>
    </div>
  </div>
</template>
