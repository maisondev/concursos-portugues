<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRoadmapStore } from '@/stores/roadmap'
import { useProgressStore } from '@/stores/progress'
import AppProgressBar from '@/components/atoms/AppProgressBar.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'

const router = useRouter()
const roadmapStore = useRoadmapStore()
const progressStore = useProgressStore()

defineProps<{
  roadmapId: string
}>()

const priorityLabels = {
  normal: 'Normal',
  alta: 'Alta',
  maxima: 'Máxima ⭐'
}

const priorityColors = {
  normal: 'gray',
  alta: 'yellow',
  maxima: 'purple'
} as const

function navigateToBlock(blockId: string) {
  router.push({
    name: 'block-detail',
    params: {
      roadmapId: 'interpretacao-textos',
      blockId
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-5xl mx-auto p-4 space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {{ roadmapStore.activeRoadmap.title }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          {{ roadmapStore.activeRoadmap.description }}
        </p>
      </div>

      <!-- Overall Progress -->
      <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Progresso Geral do Roadmap</p>
        <AppProgressBar :value="progressStore.overallPercent" show-label />
      </div>

      <!-- Blocks Grid -->
      <div class="space-y-3">
        <div
          v-for="(block, idx) in roadmapStore.activeRoadmap.blocks"
          :key="block.id"
          @click="navigateToBlock(block.id)"
          class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <!-- Title and Priority -->
              <div class="flex items-center gap-3 mb-2">
                <span class="text-lg font-semibold text-gray-500 dark:text-gray-400">{{ idx + 1 }}.</span>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white break-words">
                    {{ block.title }}
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ block.topics.length }} tópicos
                  </p>
                </div>
              </div>

              <!-- Badges -->
              <div class="flex gap-2 mb-3 flex-wrap">
                <AppBadge :color="priorityColors[block.priority]" size="sm">
                  {{ priorityLabels[block.priority] }}
                </AppBadge>
              </div>

              <!-- Progress Bar -->
              <AppProgressBar
                :value="progressStore.blockProgressPercent(block.id)"
                :color="block.priority === 'maxima' ? 'blue' : block.priority === 'alta' ? 'yellow' : 'green'"
              />

              <!-- Stats -->
              <div class="mt-2 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span>{{ block.topics.filter(t => t.status === 'concluido').length }}/{{ block.topics.length }} concluídos</span>
                <span>{{ progressStore.blockProgressPercent(block.id) }}%</span>
              </div>
            </div>

            <!-- Arrow -->
            <div class="text-2xl text-gray-400 dark:text-gray-500">→</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
