<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDailyLogStore } from '@/stores/dailyLog'

const router = useRouter()
const dailyLogStore = useDailyLogStore()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Início</h1>
      <p class="text-gray-600 dark:text-gray-300">Bem-vindo ao Roadmap de Interpretação de Textos</p>

      <div class="mt-8 flex gap-4">
        <button
          @click="router.push('/roadmap/interpretacao-textos')"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ver Roadmap
        </button>
        <button
          @click="router.push('/dashboard')"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Dashboard
        </button>
      </div>
    </div>
  </div>
</template>
