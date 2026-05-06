<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoadmapStore } from '@/stores/roadmap'
import { useDailyLogStore } from '@/stores/dailyLog'
import { useProgressStore } from '@/stores/progress'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import StatBadge from '@/components/molecules/StatBadge.vue'
import DailyLogEntry from '@/components/molecules/DailyLogEntry.vue'

const router = useRouter()
const roadmapStore = useRoadmapStore()
const dailyLogStore = useDailyLogStore()
const progressStore = useProgressStore()

const showAddRoadmapModal = ref(false)
const newRoadmapTitle = ref('')
const newRoadmapDescription = ref('')

dailyLogStore.initLogs()

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
  if (!roadmap) return { blocks: 0, topics: 0, percent: 0 }

  let totalTopics = 0
  let completedTopics = 0
  roadmap.blocks.forEach(block => {
    totalTopics += block.topics.length
    completedTopics += block.topics.filter(t => t.status === 'concluido').length
  })

  return {
    blocks: roadmap.blocks.length,
    topics: totalTopics,
    percent: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
  }
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-6xl mx-auto p-4 space-y-8">
      <!-- Header -->
      <div class="text-center py-8">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-3">
          📚 Meus Roadmaps
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
          + Novo Roadmap
        </AppButton>
      </div>

      <!-- Roadmaps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(roadmap, id) in roadmapStore.roadmaps"
          :key="id"
          @click="navigateToRoadmap(id)"
          class="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer space-y-4"
        >
          <!-- Title -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white break-words">
              {{ roadmap.title }}
            </h3>
            <p v-if="roadmap.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ roadmap.description }}
            </p>
          </div>

          <!-- Stats -->
          <div class="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span class="font-semibold text-gray-900 dark:text-white">{{ getRoadmapStats(id).blocks }}</span>
              <span> módulos</span>
            </div>
            <div>
              <span class="font-semibold text-gray-900 dark:text-white">{{ getRoadmapStats(id).topics }}</span>
              <span> tópicos</span>
            </div>
          </div>

          <!-- Progress -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Progresso</span>
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ getRoadmapStats(id).percent }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                :style="{ width: getRoadmapStats(id).percent + '%' }"
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              />
            </div>
          </div>

          <!-- Arrow -->
          <div class="text-gray-400 text-right">
            <AppIcon name="arrow-right" size="md" />
          </div>
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
