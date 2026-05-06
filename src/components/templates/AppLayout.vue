<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDailyLogStore } from '@/stores/dailyLog'
import AppNavBar from '@/components/templates/AppNavBar.vue'

const router = useRouter()
const dailyLogStore = useDailyLogStore()

dailyLogStore.initLogs()
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Bar -->
    <AppNavBar />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-[120rem] mx-auto w-full 2xl:px-6 min-[2560px]:max-w-[140rem] min-[2560px]:px-8 min-[3840px]:max-w-[160rem] min-[3840px]:px-10">
        <RouterView />
      </div>
    </main>

    <!-- Desktop Sidebar Navigation (optional, not used in this layout) -->

    <!-- Footer -->
    <footer class="border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mt-12 py-6">
      <div class="max-w-[120rem] mx-auto px-4 2xl:px-6 min-[2560px]:max-w-[140rem] min-[2560px]:px-8 min-[3840px]:max-w-[160rem] min-[3840px]:px-10 space-y-4">
        <div class="flex flex-wrap justify-center gap-6 text-sm">
          <button @click="router.push('/help')" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Ajuda
          </button>
          <button @click="router.push('/changelog')" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Changelog
          </button>
          <a href="https://github.com/maisondev/concursos-portugues" target="_blank" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            GitHub
          </a>
        </div>
        <div class="text-center text-xs text-gray-600 dark:text-gray-400">
          <p>Roadmap de Estudo para Concursos — v1.4.0</p>
        </div>
      </div>
    </footer>
  </div>
</template>
