<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useDailyLogStore } from '@/stores/dailyLog'
import AppButton from '@/components/atoms/AppButton.vue'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const dailyLogStore = useDailyLogStore()

dailyLogStore.initLogs()

function isActive(name: string): boolean {
  return route.name === name
}

function toggleTheme() {
  settingsStore.toggleTheme()
}

const navItems = [
  { name: 'home', label: '🏠 Início', icon: '🏠' },
  { name: 'roadmap', label: '🗺️ Roadmap', icon: '🗺️' },
  { name: 'dashboard', label: '📊 Dashboard', icon: '📊' },
  { name: 'settings', label: '⚙️ Configurações', icon: '⚙️' }
]
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <header class="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl">📚</span>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white hidden md:block">Concursos Português</h1>
        </div>

        <div class="flex items-center gap-4">
          <span v-if="dailyLogStore.streakDays > 0" class="flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400">
            🔥 {{ dailyLogStore.streakDays }} dias
          </span>
          <AppButton variant="ghost" size="sm" @click="toggleTheme">
            {{ settingsStore.settings.theme === 'dark' ? '☀️' : '🌙' }}
          </AppButton>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden border-t border-gray-300 dark:border-gray-700 px-4 py-2 flex gap-1 overflow-x-auto">
        <button
          v-for="item in navItems"
          :key="item.name"
          @click="router.push(`/${item.name === 'home' ? '' : item.name}`)"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            isActive(item.name)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          {{ item.icon }} {{ item.label }}
        </button>
      </div>
    </header>

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
