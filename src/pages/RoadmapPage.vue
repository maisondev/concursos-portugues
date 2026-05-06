<script setup lang="ts">
import { useRoadmapStore } from '@/stores/roadmap'

defineProps<{
  roadmapId: string
}>()

const roadmapStore = useRoadmapStore()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 p-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {{ roadmapStore.activeRoadmap.title }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mb-8">
        {{ roadmapStore.activeRoadmap.description }}
      </p>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="block in roadmapStore.activeRoadmap.blocks"
          :key="block.id"
          class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ block.title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ block.topics.length }} tópicos
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
