<script setup lang="ts">
import { useRoadmapStore } from '@/stores/roadmap'

defineProps<{
  roadmapId: string
  blockId: string
}>()

const roadmapStore = useRoadmapStore()
const block = roadmapStore.blockById(blockId)
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 v-if="block" class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {{ block.title }}
      </h1>

      <div v-if="block" class="space-y-2">
        <div
          v-for="topic in block.topics"
          :key="topic.id"
          class="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
        >
          <p class="font-medium text-gray-900 dark:text-white">{{ topic.title }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Status: {{ topic.status }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
