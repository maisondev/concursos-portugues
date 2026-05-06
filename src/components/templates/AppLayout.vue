<script setup lang="ts">
import { useDailyLogStore } from '@/stores/dailyLog'
import AppNavBar from '@/components/templates/AppNavBar.vue'

const dailyLogStore = useDailyLogStore()

dailyLogStore.initLogs()
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900">
    <!-- Navigation Bar -->
    <AppNavBar />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-6xl mx-auto">
        <RouterView />
      </div>
    </main>

    <!-- Desktop Sidebar Navigation (optional, not used in this layout) -->

    <!-- Footer -->
    <footer class="border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mt-12 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>Roadmap de Estudo para Concursos — v1.0 • <a href="https://github.com/maisondev/concursos-portugues" target="_blank" class="hover:underline">GitHub</a></p>
    </footer>
  </div>
</template>
